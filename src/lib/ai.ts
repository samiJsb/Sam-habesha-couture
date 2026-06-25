import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateProjectInsights(projectData: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this project and provide 3 strategic insights for business growth:
      Project Name: ${projectData.name}
      Description: ${projectData.description}
      Status: ${projectData.status}`,
      config: {
        systemInstruction: "You are a senior business strategist and AI consultant. Provide concise, high-value insights.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    throw error;
  }
}

export async function summarizeWorkflow(tasks: any[]) {
  try {
    const tasksStr = tasks.map(t => `- ${t.name} (${t.status})`).join('\n');
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the current workflow efficiency and identify risks based on these tasks:\n${tasksStr}`,
    });

    return response.text;
  } catch (error) {
    console.error("AI Workflow Summary Error:", error);
    throw error;
  }
}
