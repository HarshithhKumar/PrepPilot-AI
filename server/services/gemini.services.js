const GEMINI_MODEL = "gemini-3.8-flash"
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export const generateGeminiResponse = async (prompt) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY must be configured")
        }

        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        })

        const responseText = await response.text()
        let data
        try {
            data = responseText ? JSON.parse(responseText) : {}
        } catch {
            data = { rawResponse: responseText.slice(0, 1000) }
        }

        if (!response.ok) {
            const apiMessage = data.error?.message || data.rawResponse || "No error details returned"
            const apiStatus = data.error?.status || "UNKNOWN"
            // Google’s error response does not contain the request header/API key.
            console.error(`Gemini API error: HTTP ${response.status} (${apiStatus}) - ${apiMessage}`)
            throw new Error(`Gemini API returned HTTP ${response.status}: ${apiMessage}`)
        }

        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (!generatedText) {
            const blockReason = data.promptFeedback?.blockReason
            throw new Error(blockReason
                ? `Gemini returned no content (block reason: ${blockReason})`
                : "Gemini returned no generated content")
        }

        try {
            return JSON.parse(generatedText)
        } catch {
            throw new Error("Gemini returned invalid JSON")
        }
    } catch (error) {
        console.error("Gemini generation failed:", error.message)
        throw new Error("Gemini generation failed", { cause: error })
    }
}
