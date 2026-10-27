import Notes from "../models/notes.model.js"
import UserModel from "../models/user.model.js"
import { generateGeminiResponse } from "../services/gemini.services.js"
import { buildPrompt } from "../utils/promptBuilder.js"

export const generateNotes = async (req, res) => {
    let reservedUserId
    try {
        const {
            topic,
            classLevel,
            examType,
            revisionMode = false,
            includeDiagram = false,
            includeChart = false
        } = req.body || {};
        if (typeof topic !== "string" || !topic.trim() || topic.trim().length > 160) {
            return res.status(400).json({ message: "Topic must be between 1 and 160 characters" })
        }
        if ([classLevel, examType].some(
            (value) => value !== undefined && (typeof value !== "string" || value.length > 80)
        )) {
            return res.status(400).json({ message: "Class level and exam type must be 80 characters or fewer" })
        }
        if ([revisionMode, includeDiagram, includeChart].some((value) => typeof value !== "boolean")) {
            return res.status(400).json({ message: "Study options must be boolean values" })
        }
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({ message: "User was not found" })
        }

        const reservedUser = await UserModel.findOneAndUpdate(
            { _id: user._id, credits: { $gte: 10 } },
            { $inc: { credits: -10 } },
            { new: true }
        )
        if (!reservedUser) {
            return res.status(403).json({
                message: "Insufficient credits. At least 10 credits are required."
            });
        }
        reservedUserId = user._id
        if (reservedUser.credits === 0) {
            reservedUser.isCreditAvailable = false
            await reservedUser.save()
        }

        const prompt = buildPrompt({
            topic: topic.trim(),
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart
        })


        const aiResponse = await generateGeminiResponse(prompt)
        if (!aiResponse || typeof aiResponse.notes !== "string" ||
            !aiResponse.subTopics || typeof aiResponse.subTopics !== "object" ||
            Array.isArray(aiResponse.subTopics) ||
            !Array.isArray(aiResponse.revisionPoints) ||
            !Array.isArray(aiResponse.questions?.short) ||
            !Array.isArray(aiResponse.questions?.long)) {
            throw new Error("Gemini returned study notes in an unsupported format")
        }

        const notes = await Notes.create({
            user: user._id,
            topic: topic.trim(),
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart,
            content: aiResponse


        })


    reservedUserId = undefined
    return res.status(200).json({
        data: aiResponse,
        noteId: notes._id,
        creditsLeft: reservedUser.credits
    })
    } catch (error) {
    if (reservedUserId) {
        try {
            await UserModel.findByIdAndUpdate(reservedUserId, {
                $inc: { credits: 10 },
                $set: { isCreditAvailable: true }
            })
        } catch (refundError) {
            console.error("Could not refund reserved credits:", refundError.message)
        }
    }
    console.error("Study note generation failed:", error.message)
    res.status(500).json({
        error: "AI generation failed",
        message: "Study notes could not be generated"
    });

    }
}
