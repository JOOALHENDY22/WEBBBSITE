import { GoogleGenAI } from "@google/genai";

async function test() {
  const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6JS-PykoMvrOPJ1dvHtwVyKKXuiWvWNAIo1ZKoX6ZCbUg" });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: "Return a JSON array with one object { \"test\": \"ok\" }",
      config: {
        responseMimeType: "application/json",
      }
    });
    console.log("Response text:", response.text);
  } catch (e) {
    console.error("Error:", e.message);
  }
}

test();
