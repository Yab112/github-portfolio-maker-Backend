import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY 
});

const defaultParams = {
    "model": "llama-3.3-70b-versatile",
    "temperature": 1,
    "max_completion_tokens": 10024,
    "top_p": 1,
    "stream": true,
    "stop": null
};

export async function getChatStream(prompt) {
    try {
        return await groq.chat.completions.create({
            ...defaultParams,
            messages: [{ role: "user", content: prompt }]
        });
    } catch (error) {
        throw new Error(`Groq API Error: ${error.message}`);
    }
}