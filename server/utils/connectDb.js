import mongoose from "mongoose";

const connectDb = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL must be configured")
        }
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 5000
        })
        console.log("DB Connected")
        return true
    } catch (error) {
        const causeCodes = Array.from(error.reason?.servers?.values?.() || [])
            .map((server) => server.error?.code)
            .filter((code) => typeof code === "string" || typeof code === "number")
        console.error("MongoDB connection failed:", {
            name: error.name,
            code: error.code,
            causeCodes
        })
        return false
    }
}
export default connectDb