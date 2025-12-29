import { GoogleGenAI, Type } from "@google/genai";
import { CRM_MODEL, LeadAnalysis } from "../types";

// Safe initialization
const apiKey = process.env.API_KEY || 'MISSING_KEY';
const ai = new GoogleGenAI({ apiKey });

export const getGeminiClient = () => {
    if (apiKey === 'MISSING_KEY') {
        console.warn("API Key is missing. AI features will be disabled.");
    }
    return ai;
};

export const analyzeLead = async (notes: string, company: string): Promise<LeadAnalysis> => {
  if (apiKey === 'MISSING_KEY') {
      return { score: 0, reasoning: "API Key missing.", suggestedAction: "Configure API Key" };
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
    // Fallback if AI fails
    return { score: 50, reasoning: "Analysis currently unavailable.", suggestedAction: "Review manually" };
  }
};

export const generatePipelineInsight = async (data: any) => {
    if (apiKey === 'MISSING_KEY') return "Welcome to KAA CRM. Please configure your API Key to enable AI insights.";
    
    try {
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
    if (apiKey === 'MISSING_KEY') return "API Key missing. Cannot draft email.";
    
    try {
        const response = await ai.models.generateContent({
            model: CRM_MODEL,
            contents: `Draft a short, professional email to ${recipient} about "${topic}". Do not include subject line placeholders, just the body.`,
        });
        return response.text || "";
    } catch (error) {
        console.error(error);
        return "";
    }
};

export const generateImage = async (prompt: string) => {
    if (apiKey === 'MISSING_KEY') throw new Error("API Key missing");
    
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