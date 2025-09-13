
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function base64ToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64.split(',')[1],
      mimeType
    },
  };
}

export async function readPlateFromImage(imageDataUrl: string): Promise<string | null> {
  const model = 'gemini-2.5-flash';
  const imagePart = base64ToGenerativePart(imageDataUrl, "image/jpeg");
  
  const prompt = `Analyze the image and extract the car license plate number.
  Respond with only the license plate string in the Brazilian formats 'ABC1234' or 'ABC1D23'. 
  If you cannot find a clear license plate, respond with the exact string 'NOT_FOUND'.`;

  try {
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, {text: prompt}] },
    });
    
    const text = response.text.trim().toUpperCase();

    if (text === 'NOT_FOUND' || text.length < 7) {
      return null;
    }

    // Basic validation for Brazilian plate formats
    const mercosulRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    const oldRegex = /^[A-Z]{3}[0-9]{4}$/;

    if (mercosulRegex.test(text) || oldRegex.test(text)) {
        return text;
    }

    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
}
