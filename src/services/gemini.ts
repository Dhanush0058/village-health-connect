
import { GoogleGenerativeAI } from "@google/generative-ai";

// SECURITY NOTE: In a production app, never store keys directly in frontend code.
// Ideally, use a backend proxy. For this demo/prototype, we are using the key directly.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCFfVkG4PSCYA_n3tBbXllRhSIVC2f4G_U";

const genAI = new GoogleGenerativeAI(API_KEY);

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export const getGeminiResponse = async (userMessage: string, history: ChatMessage[] = [], context: string = "") => {
    try {
        // Using user-requested model
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

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

        // valid roles for history are 'user' and 'model'. 'system' is not directly supported in history for gemini-pro yet in the same way, 
        // so we prepend it to the first message or use it as context.
        // We will construct a chat session.

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // Prepend system prompt to the user message for better context since system instructions are model-dependent
        const finalPrompt = `${systemPrompt}\n\nUser: ${userMessage}`;

        const result = await chat.sendMessage(finalPrompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Error calling Gemini AI:", error);
        // Expose the actual error to the user for debugging
        return `Connection Error: ${error.message || error.toString()}. Please check API key restrictions.`;
    }
};
