import { SUPPORT_KEYS } from '../constants';

export const callOpenAI = async (message: string) => {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPPORT_KEYS.OPEN_AI}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: message }]
      })
    });
    if (!res.ok) throw new Error("API Error");
    const data = await res.json();
    return data.choices[0].message.content;
  } catch (e) {
    console.error(e);
    return "Connection to OpenAI Mainframe Failed."; 
  }
};

export const callOpenRouter = async (message: string) => {
   try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPPORT_KEYS.OPEN_ROUTER}`
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free", // Using a solid default
        messages: [{ role: "user", content: message }]
      })
    });
    if (!res.ok) throw new Error("API Error");
    const data = await res.json();
    return data.choices[0].message.content;
  } catch (e) {
    console.error(e);
    return "OpenRouter Relay Offline."; 
  }
};

export const callEdenAI = async (message: string) => {
   try {
    const res = await fetch('https://api.edenai.run/v2/text/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPPORT_KEYS.EDEN_AI}`
      },
      body: JSON.stringify({
        providers: "openai",
        text: message,
        chatbot_global_action: "Act as a helpful tech support agent for Codesphere 2.0.",
        temperature: 0.2,
        max_tokens: 250
      })
    });
    if (!res.ok) throw new Error("API Error");
    const data = await res.json();
    // Eden returns results per provider
    return data['openai']?.generated_text || "Eden AI Protocol Sync Failed.";
  } catch (e) {
    console.error(e);
    return "Eden AI Protocol Sync Failed."; 
  }
};

export const callLongcatAI = async (message: string) => {
  // Placeholder/Simulation since standard public endpoint documentation for 'ak_' key style is ambiguous.
  // We assume OpenAI compatibility or return a mock for the specific user request context.
  try {
     // Mocking a response for the demo as the specific vendor API isn't standard
     await new Promise(r => setTimeout(r, 1500));
     return `[LongcatAI Node]: Processed query: "${message}". \n(Note: Specific endpoint for LongcatAI pending configuration. Using simulation.)`;
  } catch (e) {
     return "LongcatAI Node Unreachable.";
  }
};