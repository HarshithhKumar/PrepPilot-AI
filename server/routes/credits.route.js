import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createCreditsOrder } from "../controllers/credits.controller.js"
import requireDatabase from "../middleware/requireDatabase.js"




const creditRouter = express.Router()
creditRouter.post("/order" , isAuth ,requireDatabase,createCreditsOrder )

export default creditRouter