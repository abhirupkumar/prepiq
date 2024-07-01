import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY!,
    model: "gemini-1.5-flash",
    maxOutputTokens: 2048,
});