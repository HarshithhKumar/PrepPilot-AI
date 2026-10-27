import express from "express"
import isAuth from "../middleware/isAuth.js"
import { generateNotes } from "../controllers/generate.controller.js"
import { getMyNotes, getSingleNotes } from "../controllers/notes.controller.js"
import requireDatabase from "../middleware/requireDatabase.js"



const notesRouter = express.Router()


notesRouter.post("/generate-notes",isAuth,requireDatabase,generateNotes)
notesRouter.get("/getnotes", isAuth,requireDatabase,getMyNotes)
notesRouter.get("/:id" , isAuth,requireDatabase,getSingleNotes)

export default notesRouter