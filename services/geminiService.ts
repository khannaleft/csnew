
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development environments where the key might not be set.
  // In a real production deployment, the key should always be present.
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateProductDescription = async (productName: string): Promise<string> => {
  if (!API_KEY) {
    return "AI-powered descriptions are currently unavailable. Please check API key configuration.";
  }
  
  try {
    const prompt = `Generate a compelling, short e-commerce product description for a product named "${productName}". The description should be exciting, highlight potential benefits, and be around 2-3 sentences long. Do not use markdown or special formatting.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating product description:", error);
    return "Failed to generate description. Please try again later.";
  }
};
