
const Gemini_URL = 
"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent"

export const generateGeminiResponse = async (prompt) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY must be configured")
        }

        const response = await fetch(Gemini_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        })

        if (!response.ok) {
            throw new Error(`Gemini API returned HTTP ${response.status}`)
        }

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (!text) throw new Error("Gemini returned no generated content")
        return JSON.parse(text)
    } catch (error) {
        console.error("Gemini generation failed:", error.message)
        throw new Error("Gemini generation failed", { cause: error })
    }
}