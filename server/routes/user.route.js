import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser } from "../controllers/user.controller.js"
import requireDatabase from "../middleware/requireDatabase.js"


const userRouter = express.Router()


userRouter.get("/currentuser",isAuth,requireDatabase,getCurrentUser)

export default userRouter