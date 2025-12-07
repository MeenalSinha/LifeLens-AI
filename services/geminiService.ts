import { GoogleGenAI, Chat, Content } from "@google/genai";
import { MODEL_NAME, SYSTEM_INSTRUCTION } from "../constants";
import { Message, Attachment } from "../types";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAIInstance = () => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
      // In a real app, we might handle this more gracefully UI-wise
    }
    ai = new GoogleGenAI({ apiKey: apiKey });
  }
  return ai;
};

export const initializeChat = async () => {
  const instance = getAIInstance();
  if (!instance) return null;

  chatSession = instance.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.4, // Lower temperature for more factual/grounded explanations
    },
  });
  return chatSession;
};

// Simple retry helper
const retryOperation = async <T>(operation: () => Promise<T>, retries = 1, delay = 1000): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Gemini API call failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOperation(operation, retries - 1, delay);
    }
    throw error;
  }
};

export const sendMessageToGemini = async (
  text: string,
  attachments: Attachment[]
): Promise<string> => {
  const instance = getAIInstance();
  if (!instance) throw new Error("AI not initialized");
  
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) throw new Error("Failed to start chat session");

  // Construct parts
  const parts: any[] = [];

  // Add attachments first
  for (const att of attachments) {
    if (att.base64) {
      parts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: att.base64,
        },
      });
    }
  }

  // Add text prompt
  if (text.trim()) {
    parts.push({ text: text });
  } else if (parts.length === 0) {
      // Fallback if no text and no file (shouldn't happen due to UI validation)
      parts.push({ text: "Explain this." });
  }

  try {
    // Wrap the call in retry logic
    const response = await retryOperation(() => chatSession!.sendMessage({
      message: parts
    }));

    return response.text || "I processed that, but I don't have a text response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};