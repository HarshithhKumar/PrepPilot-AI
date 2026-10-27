import mongoose from "mongoose"

const processedPaymentSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    credits: {
        type: Number,
        required: true,
        min: 1
    }
}, { timestamps: true })

const ProcessedPayment = mongoose.model("ProcessedPayment", processedPaymentSchema)

export default ProcessedPayment
