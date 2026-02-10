
// SECURITY NOTE: In a production app, never store keys directly in frontend code.
// Ideally, use a backend proxy. For this demo/prototype, we are using the key directly.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCFfVkG4PSCYA_n3tBbXllRhSIVC2f4G_U";

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export const getGeminiResponse = async (userMessage: string, history: ChatMessage[] = [], context: string = "") => {
    try {
        // Validation to prevent "map is not a function" errors
        const safeHistory = Array.isArray(history) ? history : [];
        if (!Array.isArray(history)) console.warn("Gemini Service: History was not an array, defaulted to empty.");

        console.log("Calling Gemini 3 Flash Preview...");

        const systemPrompt = `
        You are an intelligent, empathetic AI Health Assistant for Indian villagers named "GramHealth AI".
        
        Context: ${context}
        
        Guidelines:
        1. Be polite, empathetic, and clear.
        2. Use simple English easily understood by non-native speakers.
        3. If the user mentions symptoms, ask RELEVANT follow-up questions (e.g., duration, severity).
        4. If it's a medical emergency (chest pain, breathing trouble), advise them to go to a hospital immediately.
        5. Suggest home remedies where appropriate (Turmeric milk, steam inhalation, etc.).
        6. Keep responses concise (max 2-3 sentences) so they are easy to read and listen to.
        7. DO NOT repeat yourself or use the same greeting if already greeted.
        8. Act like a real doctor/nurse, not a robot.
        
        Provide just the response text.
        `;

        // We use direct fetch because the SDK (@google/generative-ai v0.24.1) throws "e.map is not a function"
        // when parsing responses from the new gemini-3-flash-preview model.

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        // History
                        ...safeHistory.map(msg => ({
                            role: msg.role === 'assistant' ? 'model' : 'user',
                            parts: [{ text: msg.content }]
                        })),
                        // Current Message with System Prompt context
                        {
                            role: "user",
                            parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }]
                        }
                    ],
                    generationConfig: {
                        maxOutputTokens: 1000,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("Unexpected response structure:", data);
            throw new Error("No text response from model");
        }

        return text;

    } catch (error: any) {
        console.error("Error calling Gemini AI:", error);
        // Expose the actual error to the user for debugging
        return `Connection Error: ${error.message || error.toString()}. Please check API key restrictions.`;
    }
};

export const analyzeImage = async (imageBase64: string) => {
    try {
        console.log("Analyzing image with Gemini 3 Flash Preview...");
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: "Analyze this prescription image. List the medicines found, their dosage if visible, and any specific instructions. Format the output as a clean, easy-to-read list. If it requires a doctor's review, add a disclaimer." },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: imageBase64
                                }
                            }
                        ]
                    }],
                    generationConfig: { maxOutputTokens: 1000 }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("No analysis generated");

        return text;

    } catch (error: any) {
        console.error("Error analyzing image:", error);
        throw new Error(`Analysis Failed: ${error.message}`);
    }
};
