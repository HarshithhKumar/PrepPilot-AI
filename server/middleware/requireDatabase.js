import mongoose from "mongoose"
import connectDb from "../utils/connectDb.js"

const requireDatabase = async (_req, res, next) => {
    if (mongoose.connection.readyState === 2) {
        return res.status(503).json({
            message: "PrepPilot storage is connecting. Please try again shortly."
        })
    }

    if (mongoose.connection.readyState !== 1) {
        const connected = await connectDb()
        if (!connected) {
            return res.status(503).json({
                message: "PrepPilot storage is temporarily unavailable. Please try again shortly."
            })
        }
    }

    return next()
}

export default requireDatabase
