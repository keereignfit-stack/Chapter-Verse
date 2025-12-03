import { GoogleGenAI, Modality, Type } from "@google/genai";
import { AIResponse, GeoLocation } from "../types";

const apiKey = process.env.API_KEY;
// IMPORTANT: In a real app, handle missing key gracefully. 
// For this environment, we assume it's injected.
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// 1. Fast AI Responses (Flash Lite) - For quick tips
export const getQuickRomanticTip = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: 'Give me one short, unique, and romantic tip for couples in under 20 words.',
    });
    return response.text || "Love is in the details.";
  } catch (error) {
    console.error("Quick tip error", error);
    return "Surprise your partner today!";
  }
};

// 2. Maps Grounding (Flash) - For Date Planning
export const findDateSpots = async (query: string, location?: GeoLocation): Promise<AIResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents: `Find 3 romantic date spots based on this request: "${query}". Provide a brief reason why it's good for a date.`,
      config,
    });

    const text = response.text || "I couldn't find specific spots, but try a local park!";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[];

    return { text, groundingChunks };
  } catch (error) {
    console.error("Maps grounding error", error);
    return { text: "Sorry, I couldn't access maps right now." };
  }
};

// 3. Search Grounding (Flash) - For Travel
export const findTravelDestinations = async (query: string): Promise<AIResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Suggest 3 romantic travel destinations for: "${query}". Include what makes them special now (trends, seasons, etc.).`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Paris is always a good idea.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[];

    return { text, groundingChunks };
  } catch (error) {
    console.error("Search grounding error", error);
    return { text: "I'm having trouble searching the web right now." };
  }
};

// 4. Thinking Mode (Pro) - For Complex Wedding Planning
export const planWedding = async (details: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a comprehensive initial wedding plan outline based on these details: "${details}". Consider budget, guest count, and theme deeply. Structure it clearly using Markdown headers.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max budget for deep reasoning
      },
    });
    return response.text || "I need more details to plan your perfect day.";
  } catch (error) {
    console.error("Thinking mode error", error);
    return "I'm having trouble thinking through this complex request right now. Please try again.";
  }
};

// 5. Chatbot (Pro) - General Assistant
export const sendChatMessage = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "You are the 'Chapter&Verse' Concierge, a sophisticated, literary, and romantic AI guide. You help users write their own love stories by assisting with dates, weddings, and travel planning.",
      }
    });
    
    const response = await chat.sendMessage({ message });
    return response.text || "I'm listening...";
  } catch (error) {
    console.error("Chat error", error);
    return "I'm having a moment of silence. Please try again.";
  }
};

// 6. TTS (Flash Audio) - Read Aloud
export const generateSpeech = async (text: string): Promise<AudioBuffer | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Calming voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    // Decode manual
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
    return audioBuffer;
  } catch (error) {
    console.error("TTS error", error);
    return null;
  }
};

export const playAudioBuffer = (buffer: AudioBuffer) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
}