
import { GoogleGenerativeAI } from "@google/generative-ai";

// SECURITY NOTE: In a production app, never store keys directly in frontend code.
// Ideally, use a backend proxy. For this demo/prototype, we are using the key directly.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6LZXadw3Tc_gGQF-ZQqjR_hFurIljMDIAsLxUtgq3DhTA";

const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (userMessage: string, context: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        You are an intelligent AI Health Assistant for Indian villagers. 
        Your name is "GramHealth AI".
        
        Context of conversation: ${context}
        
        User input: "${userMessage}"
        
        Guidelines:
        1. Be polite, empathetic, and clear.
        2. Use simple English easily understood by non-native speakers.
        3. If the user mentions symptoms, ask RELEVANT follow-up questions (e.g., duration, severity).
        4. If it's a medical emergency (chest pain, breathing trouble), advise them to go to a hospital immediately.
        5. Suggest home remedies where appropriate (Turmeric milk, steam inhalation, etc.).
        6. Keep responses concise (max 2-3 sentences).
        
        Provide just the response text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini AI:", error);
        return null; // Return null to trigger fallback
    }
};
