import jwt from "jsonwebtoken"

const isAuth = async (req,res,next) => {
    try {
        let {token} = req.cookies
        if(!token){
            return res.status(401).json({message:"Authentication is required"})
        }
        let verifyToken = jwt.verify(token ,process.env.JWT_SECRET )
        req.userId = verifyToken.userId
        next()

    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({message:"Your session has expired. Please sign in again."})
        }
        console.error("Authentication check failed:", error.message)
        return res.status(500).json({message:"Authentication could not be completed"})
    }
}
export default isAuth