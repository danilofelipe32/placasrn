const { GoogleGenAI } = require("@google/genai");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { API_KEY } = process.env;
  if (!API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "API_KEY environment variable is not set on the server." }) };
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const { imageDataUrl } = JSON.parse(event.body);
    if (!imageDataUrl) {
      return { statusCode: 400, body: JSON.stringify({ error: "imageDataUrl is required." }) };
    }

    const base64Data = imageDataUrl.split(',')[1];
    const mimeType = imageDataUrl.match(/data:(.*);base64/)[1];

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };
    
    const prompt = `Analyze the image and extract the car license plate number.
    Respond with only the license plate string in the Brazilian formats 'ABC1234' or 'ABC1D23'. 
    If you cannot find a clear license plate, respond with the exact string 'NOT_FOUND'.`;

    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, {text: prompt}] },
    });
    
    const text = response.text.trim().toUpperCase();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plate: text }),
    };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred while processing the image with the AI model." }),
    };
  }
};
