import Stripe from "stripe"
import mongoose from "mongoose"
import UserModel from "../models/user.model.js";
import ProcessedPayment from "../models/processed-payment.model.js"
import dotenv from "dotenv"
dotenv.config()

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const CREDIT_MAP = {
  100: 50,
  200: 120,
  500: 300,
};

export const createCreditsOrder = async (req,res) => {
    try {
        const userId = req.userId
        const {amount} = req.body;

         if (!CREDIT_MAP[amount]) {
      return res.status(400).json({
        message: "Invalid credit plan",
      });
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${CREDIT_MAP[amount]} Credits`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        credits: CREDIT_MAP[amount],
      },
    })

    res.status(200).json({ url: session.url });
    } catch (error) {
         res.status(500).json({ message: "Stripe error" });
    }
}


export const stripeWebhook = async (req,res) => {
    const sig = req.headers["stripe-signature"]
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )   
    } catch (error) {
         console.log("❌ Webhook signature error:", error.message);
    return res.status(400).send("Webhook Error");
    }

  if(event.type === "checkout.session.completed"){
    const session = event.data.object;

    const userId = session.metadata?.userId;
    const creditsToAdd = Number(session.metadata?.credits);
    const amount = Number(session.amount_total) / 100
    const expectedCredits = CREDIT_MAP[amount]
    if (session.payment_status !== "paid" || session.currency !== "inr" ||
        !session.id || !userId || !expectedCredits || creditsToAdd !== expectedCredits) {
    return res.status(400).json({ message: "Invalid metadata" });
  }

    const dbSession = await mongoose.startSession()
    try {
      await dbSession.withTransaction(async () => {
        const alreadyProcessed = await ProcessedPayment
          .findOne({ sessionId: session.id })
          .session(dbSession)
        if (alreadyProcessed) return

        const user = await UserModel.findByIdAndUpdate(userId, {
          $inc: { credits: creditsToAdd },
          $set: { isCreditAvailable: true },
        }, { new: true, session: dbSession })
        if (!user) throw new Error("Payment references an unknown user")

        await ProcessedPayment.create([{
          sessionId: session.id,
          user: user._id,
          credits: creditsToAdd
        }], { session: dbSession })
      })
    } catch (error) {
      if (error.code === 11000) return res.json({ received: true })
      console.error("Could not apply Stripe payment:", error.message)
      return res.status(500).json({ message: "Payment could not be applied" })
    } finally {
      await dbSession.endSession()
    }

  }

   res.json({ received: true });
}