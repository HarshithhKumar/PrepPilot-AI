import UserModel from "../models/user.model.js"

export const getCurrentUser = async (req,res) => {
    try {
        const userId = req.userId
        const user = await UserModel.findById(userId)
        if(!user){
            return res.status(404).json({message:"Current User is not found"})
        }
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            credits: user.credits,
            isCreditAvailable: user.isCreditAvailable
        })
    } catch (error) {
         console.error("Could not retrieve current user:", error.message)
         return res.status(500).json({message:"Current user could not be retrieved"})
        
    }
}