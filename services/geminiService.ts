import { GoogleGenAI, Type } from "@google/genai";
import { CRM_MODEL, LeadAnalysis } from "../types";

// Singleton instance variable
let aiInstance: GoogleGenAI | null = null;

// Lazy initialization function
export const getGeminiClient = () => {
    if (!aiInstance) {
        // Fallback to a dummy key to prevent constructor crash if env var is missing.
        // Actual API calls will fail gracefully with auth errors instead of crashing the app.
        const apiKey = process.env.API_KEY || 'MISSING_KEY';
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
};

export const analyzeLead = async (notes: string, company: string): Promise<LeadAnalysis> => {
  const ai = getGeminiClient();
  // We can check if the key is effectively valid before making a call if we want,
  // but the SDK handles auth errors.
  
  if (process.env.API_KEY === 'MISSING_KEY' || !process.env.API_KEY) {
      return { score: 50, reasoning: "API Key missing. Please configure your environment.", suggestedAction: "Configure API Key" };
  }

  try {
    const response = await ai.models.generateContent({
      model: CRM_MODEL,
      contents: `Analyze the following lead based on their notes and company (${company}). Provide a lead score (0-100), reasoning, and a suggested next action. Notes: "${notes}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Lead score from 0 to 100" },
            reasoning: { type: Type.STRING, description: "Brief explanation of the score" },
            suggestedAction: { type: Type.STRING, description: "Recommended next step (e.g. Schedule Call, Send Email)" }
          },
          required: ["score", "reasoning", "suggestedAction"]
        }
      }
    });
    
    if (response.text) {
        return JSON.parse(response.text) as LeadAnalysis;
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Lead analysis error:", error);
    return { score: 50, reasoning: "Analysis currently unavailable.", suggestedAction: "Review manually" };
  }
};

export const generatePipelineInsight = async (data: any) => {
    if (!process.env.API_KEY) return "Welcome to KAA CRM. Please configure your API Key to enable AI insights.";
    
    try {
        const ai = getGeminiClient();
        const prompt = `
        Act as a CRM Sales Manager. Review the following dashboard data and provide a concise, motivating 2-sentence executive summary.
        Highlight key wins or urgent focus areas.
        
        Data:
        Pipeline Value: ${data.pipelineValue}
        Won Revenue: ${data.wonValue}
        New Leads: ${data.newLeads}
        Open Activities: ${data.openActivities}
        Top Deal: ${data.topDeals[0]?.title} (${data.topDeals[0]?.amount})
        `;

        const response = await ai.models.generateContent({
            model: CRM_MODEL,
            contents: prompt,
        });
        return response.text || "Pipeline looks steady. Keep pushing on open deals.";
    } catch (error) {
        return "Insights unavailable. Check connection.";
    }
};

export const draftEmail = async (recipient: string, topic: string) => {
    if (!process.env.API_KEY) return "API Key missing. Cannot draft email.";
    
    try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
            model: CRM_MODEL,
            contents: `Draft a short, professional email to ${recipient} about "${topic}". Do not include subject line placeholders, just the body.`,
        });
        return response.text || "";
    } catch (error) {
        console.error(error);
        return "Could not generate email draft.";
    }
};

export const generateImage = async (prompt: string) => {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: prompt }
            ]
        }
    });
    return response;
};