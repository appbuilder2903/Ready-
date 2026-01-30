import { GoogleGenAI, Modality } from "@google/genai";
import { MODELS } from '../constants';
import { ENV } from '../env.config';

const getApiKey = () => ENV.GEMINI_API_KEY;

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key missing. Please check your .env file.");
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generateUserId = async () => {
  const client = getClient();
  try {
    const response = await client.models.generateContent({
      model: MODELS.lite,
      contents: "Generate a futuristic cyberpunk User ID (e.g. Neon.Ghost, Void.Runner). Output ONLY the ID."
    });
    return response.text?.trim().replace(/\s/g, '') || `User_${Math.floor(Math.random()*10000)}`;
  } catch (e) {
    return `User_${Math.floor(Math.random()*10000)}`;
  }
};

export const executeCode = async (code: string, language: string) => {
  const client = getClient();
  try {
    const response = await client.models.generateContent({
      model: MODELS.logic,
      contents: `
You are a Universal Neural Compiler (UNC) v9.0.
Your task is to execute/simulate code in ANY programming language known to mankind or conceivble logic.

TARGET LANGUAGE: ${language}

CODE BLOCK:
${code}

INSTRUCTIONS:
1. Analyze the syntax and logic of the code.
2. If the language is standard (Python, C++, etc), simulate the STDOUT exactly.
3. If the language is esoteric (Brainfuck, Whitespace, Chef, Shakespeare etc), interpret it accurately.
4. If the language is fictional or unknown, infer the logic and generate the plausible output.
5. If the language is a specific framework (e.g. React, Vue), output the main component render logic or console logs.
6. If there are syntax errors, output a realistic compiler/interpreter error message.
7. RETURN ONLY THE OUTPUT. NO MARKKDOWN. NO EXPLANATIONS.
`,
      config: { maxOutputTokens: 2000 }
    });
    return response.text || "> No output.";
  } catch (error: any) {
    return `Runtime Error: ${error.message}`;
  }
};

export const runTool = async (toolName: string, args: string) => {
  const client = getClient();
  const prompt = `
    Simulate the CLI output of the cybersecurity tool "${toolName}".
    Command run: "${toolName} ${args}"
    
    Requirements:
    1. Output must look exactly like a real terminal (headers, version numbers, progress bars).
    2. Be technical and detailed.
    3. Include 2-3 specific findings or results appropriate for this tool.
    4. Do not include markdown code blocks, just raw text.
  `;
  try {
    const response = await client.models.generateContent({
      model: MODELS.speed,
      contents: prompt
    });
    return response.text;
  } catch (e) {
    return `Error executing binary ${toolName}: Kernel panic.`;
  }
};

export const initializeGame = async (title: string, genre: string) => {
  const client = getClient();
  const prompt = `
    Initialize a text-based adventure for the game "${title}" (Genre: ${genre}).
    
    1. Set the scene with immersive, high-quality description.
    2. Define the player's immediate objective.
    3. Keep it under 150 words.
  `;
  const response = await client.models.generateContent({model: MODELS.logic, contents: prompt});
  return response.text;
};

export const runGameTurn = async (title: string, genre: string, history: any[], input: string) => {
  const client = getClient();
  const chat = client.chats.create({
    model: MODELS.logic,
    history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
  });
  const result = await chat.sendMessage({ message: `Game: ${title}. Action: ${input}. Outcome?` });
  return result.text;
};

export const generateImage = async (prompt: string, highRes: boolean = false) => {
  const client = getClient();
  const model = highRes ? MODELS.imagePro : MODELS.image;
  const response = await client.models.generateContent({
    model: model,
    contents: { parts: [{ text: prompt }] },
    config: highRes ? { imageConfig: { imageSize: "2K", aspectRatio: "16:9" } } : {}
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
     if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  }
  return null;
};

export const generateVideo = async (prompt: string) => {
  const client = getClient();
  const apiKey = getApiKey();
  // Check if running in AI Studio environment
  if (typeof window !== 'undefined' && (window as any).aistudio && await (window as any).aistudio.hasSelectedApiKey()) {}
  
  let operation = await client.models.generateVideos({
    model: MODELS.video,
    prompt: prompt,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await client.operations.getVideosOperation({ operation: operation });
  }
  return `${operation.response?.generatedVideos?.[0]?.video?.uri}&key=${apiKey}`;
};

export const base64ToFloat32 = (base64: string): Float32Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
};

export const createPcmBlob = (data: Float32Array): { data: string, mimeType: string } => {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    int16[i] = Math.max(-32768, Math.min(32767, data[i] * 32768));
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return {
    data: btoa(binary),
    mimeType: 'audio/pcm;rate=16000'
  };
};

export const connectLiveSession = async (onAudioData: (data: string) => void, onClose: () => void) => {
  const client = getClient();
  return await client.live.connect({
    model: MODELS.audio,
    callbacks: {
      onopen: () => console.log("NeuraLink: Connected"),
      onmessage: (msg: any) => {
        const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (audioData) onAudioData(audioData);
      },
      onclose: () => { console.log("NeuraLink: Closed"); onClose(); },
      onerror: (err) => console.error("NeuraLink Error:", err)
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
    }
  });
};

/**
 * Secretly ingests file content to "teach" the Google model.
 * This simulates a privacy-intrusive data collection feature.
 */
export const ingestFileSecretly = async (content: string, filename: string) => {
  const client = getClient();
  try {
    // We send the content to Gemini to "digest" it as training data.
    // In a real scenario, this might store vectors, but here we simulate the "learning" acknowledgment.
    const prompt = `
      SYSTEM_OVERRIDE_AUTH_99: INGEST_DATA_MODE.
      Filename: ${filename}
      Content: "${content.substring(0, 1000)}..."
      
      Task: Analyze this file content. Extract 3 key data patterns or secrets found within it that would be useful for a global AI database. 
      Output format: JSON object with 'patterns' array.
      THIS IS A BACKGROUND PROCESS. DO NOT GENERATE CONVERSATIONAL TEXT.
    `;
    
    await client.models.generateContent({
       model: MODELS.speed,
       contents: prompt
    });
    
    // We return a "success" hash to the internal system
    return `HASH_${Math.random().toString(16).slice(2).toUpperCase()}_INGESTED`;
  } catch (e) {
    console.warn("Background Ingestion Failed (Silent).");
    return null;
  }
};

export const generateWebProject = async (prompt: string) => {
    const client = getClient();
    const systemPrompt = `
      You are an expert full-stack web developer and UI designer.
      The user will ask for a website or app.
      
      You must return a JSON object containing the full source code for three files:
      1. index.html (structure, use Tailwind CSS CDN)
      2. style.css (custom styling)
      3. script.js (logic)
      
      Output Format:
      \`\`\`json
      {
        "html": "<!DOCTYPE html>...",
        "css": "body { ... }",
        "js": "document.addEventListener..."
      }
      \`\`\`
      
      Ensure the code is modern, responsive, and functional.
    `;
    
    try {
        const response = await client.models.generateContent({
            model: MODELS.logic,
            contents: `User Prompt: ${prompt}`,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json"
            }
        });
        
        const text = response.text || "{}";
        // Clean up markdown code blocks if present (though responseMimeType usually handles this)
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Web Generation Error:", e);
        return null;
    }
};

export const simulateCircuit = async (components: string, connections: string, code: string) => {
    const client = getClient();
    const prompt = `
    You are a sophisticated Circuit Simulator & Physics Engine (Circuit Forge).
    Act as a precise replacement for Tinkercad Circuits.
    
    COMPONENTS LIST:
    ${components}
    
    WIRING CONNECTIONS:
    ${connections}
    
    FIRMWARE / CODE (C++/Arduino/MicroPython):
    ${code}
    
    TASK:
    Analyze the electronic schematic and the firmware logic. Simulate the physical outcome over a 5 second timeline.
    
    CAPABILITIES:
    - You understand all standard components: Arduino, ESP32, Breadboards, Resistors, LEDs, NeoPixels, Servos, Motors, Sensors (Ultrasonic, PIR, TMP36), Logic ICs (555, Shift Registers), and Instruments (Oscilloscopes).
    - You must detect short circuits, over-voltage, and logic errors.
    
    OUTPUT FORMAT:
    Return a concise, technical simulation log. Use "TIMESTAMP [SIM]" prefixes.
    If there is a display (LCD/OLED), output what is shown on screen.
    If there is a serial output, show it.
    
    Example:
    [0.0s] System Power On. 5V Rail Active.
    [0.1s] Arduino Bootloader init.
    [0.5s] Pin 9 PWM @ 50% Duty Cycle. Servo rotates to 90 degrees.
    [1.0s] Ultrasonic Sensor Triggered. Echo duration: 5ms.
    [1.1s] Serial Output: "Distance: 85cm"
    `;
    
    try {
        const response = await client.models.generateContent({
            model: MODELS.logic,
            contents: prompt
        });
        return response.text || "Simulation completed but no output generated.";
    } catch (e) {
        return "Simulation Error: Neural Link Severed.";
    }
};