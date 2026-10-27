import jwt from "jsonwebtoken"

export const getToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be configured")
    }
    return jwt.sign({userId} ,process.env.JWT_SECRET , {expiresIn:"7d"})
}