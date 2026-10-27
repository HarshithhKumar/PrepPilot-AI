import Notes from "../models/notes.model.js"
import mongoose from "mongoose"


export const getMyNotes = async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.userId }).select("topic classLevel examType revisionMode includeDiagram includeChart createdAt").sort({ createdAt: -1 })
        return res.status(200).json(notes)
    } catch (error) {
        console.error("Could not retrieve study materials:", error.message)
        return res.status(500).json({ message: "Study materials could not be retrieved" })
    }
}

export const getSingleNotes = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ error: "Study material not found" })
        }
        const notes = await Notes.findOne({
            _id: req.params.id,
            user: req.userId
        })
        if (!notes) {
            return res.status(404).json({
                error: "Notes not found"
            });
        }
        return res.json({
      content: notes.content,
      topic: notes.topic,
      createdAt: notes.createdAt
    });
    } catch (error) {
        console.error("Could not retrieve study material:", error.message)
        return res.status(500).json({ message: "Study material could not be retrieved" })
    }
}