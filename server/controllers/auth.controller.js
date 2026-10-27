import UserModel from "../models/user.model.js"
import { getToken } from "../utils/token.js"
import { verifyFirebaseIdentity } from "../services/firebase-auth.services.js"


export const googleAuth = async (req,res) => {
    try {
        const { idToken } = req.body || {}
        if (typeof idToken !== "string" || !idToken.trim()) {
            return res.status(400).json({ message: "A Firebase ID token is required" })
        }

        const identity = await verifyFirebaseIdentity(idToken)
        if (!identity) {
            return res.status(401).json({ message: "Google sign-in could not be verified" })
        }

        const user = await UserModel.findOneAndUpdate(
            { email: identity.email },
            { $setOnInsert: identity },
            { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
        )
        const token = getToken(user._id)
        const isProduction = process.env.NODE_ENV === "production"
        res.cookie("token" , token , {
            httpOnly:true,
            secure:isProduction,
            sameSite:isProduction ? "none" : "lax",
            maxAge:7 * 24 * 60 * 60 * 1000

        })
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
            isCreditAvailable: user.isCreditAvailable
        })
    } catch (error) {
        console.error("Google sign-in failed:", error.message)
        return res.status(500).json({message:"Google sign-in could not be completed"})
    }
    
}

export const logOut = async (req,res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production"
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        })
         return res.status(200).json({message:"LogOut Successfully"})
    } catch (error) {
        console.error("Logout failed:", error.message)
        return res.status(500).json({message:"Logout could not be completed"})
    }
}