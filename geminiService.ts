
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A more user-friendly message for the console.
  console.warn("Gemini API key not found in environment variables. Bot responses will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const geminiService = {
  getBotResponse: async (message: string, userName: string): Promise<string> => {
    if (!API_KEY) {
      return "API Key not configured. The bot is currently offline.";
    }

    try {
      const systemInstruction = `You are a helpful and friendly chat bot named ${userName}. Your responses should be conversational, concise, and feel like a real person is talking. Avoid long paragraphs.`;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      });

      return response.text;
    } catch (error) {
      console.error("Error fetching bot response:", error);
      return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }
  },
};
