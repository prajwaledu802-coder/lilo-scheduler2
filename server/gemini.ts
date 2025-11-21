// Reference: blueprint:javascript_gemini
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

export async function chatWithLilo(
  message: string,
  userTasks: any[]
): Promise<string> {
  const systemPrompt = `You are Lilo, an AI scheduling assistant for a time management app.
You help users plan their schedules, create tasks, and organize their time.

The user has these current tasks:
${JSON.stringify(userTasks, null, 2)}

When users ask you to create tasks or schedules, provide clear, actionable suggestions.
Be friendly, concise, and helpful. Focus on productivity and time management advice.`;

  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: "gemini-2.0-flash-exp",
    config: {
      systemInstruction: systemPrompt,
    },
    contents: message,
  });

  return response.text || "I'm here to help! Could you please rephrase that?";
}

export async function parseTaskFromNaturalLanguage(
  message: string
): Promise<{ shouldCreateTask: boolean; task?: any }> {
  const systemPrompt = `You are a task parser. Analyze user messages and determine if they want to create a task.
If yes, extract the task details and return JSON in this format:
{
  "shouldCreateTask": true,
  "task": {
    "title": "Task title",
    "date": "YYYY-MM-DD",
    "time": "HH:mm",
    "notes": "Optional notes",
    "repeat": "one-time|daily|weekly|monthly|yearly",
    "priority": "low|medium|high"
  }
}

If no task should be created, return: {"shouldCreateTask": false}

Current date for reference: ${new Date().toISOString().split("T")[0]}`;

  try {
    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: message,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
  } catch (error) {
    console.error("Error parsing task:", error);
  }

  return { shouldCreateTask: false };
}
