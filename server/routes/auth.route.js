import express from "express"
import { googleAuth, logOut } from "../controllers/auth.controller.js"
import requireDatabase from "../middleware/requireDatabase.js"

const authRouter = express.Router()

authRouter.post("/google" , requireDatabase, googleAuth)
authRouter.get("/logout" , logOut)
export default authRouter