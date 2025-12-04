import { GoogleGenAI, Type } from "@google/genai";
import { CandidateProfile, SearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

export const GeminiService = {
  /**
   * Parses raw resume text into a structured CandidateProfile
   */
  parseResume: async (rawText: string): Promise<Omit<CandidateProfile, 'id' | 'addedAt'>> => {
    const prompt = `
      Analyze the following resume text and extract the structured data.
      If a field is missing, make a reasonable guess or leave empty.
      
      Resume Text:
      ${rawText}
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              summary: { type: Type.STRING },
              skills: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              yearsOfExperience: { type: Type.NUMBER }
            },
            required: ["fullName", "email", "skills", "summary"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text);

    } catch (error) {
      console.error("Error parsing resume:", error);
      throw error;
    }
  },

  /**
   * Ranks candidates based on a job description or search query.
   */
  rankCandidates: async (query: string, candidates: CandidateProfile[]): Promise<SearchResult[]> => {
    if (candidates.length === 0) return [];

    const candidatesJson = JSON.stringify(
      candidates.map(c => ({
        id: c.id,
        name: c.fullName,
        skills: c.skills,
        summary: c.summary,
        experience: c.yearsOfExperience
      }))
    );

    const prompt = `
      You are an expert HR recruiter. 
      Job Description / Search Query: "${query}"
      
      Below is a list of candidates in JSON format.
      Rank these candidates based on how well they match the query.
      Return a list of objects with candidateId, score (0-100), and a brief matchReasoning.
      
      Candidates:
      ${candidatesJson}
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                candidateId: { type: Type.STRING },
                score: { type: Type.NUMBER },
                matchReasoning: { type: Type.STRING }
              },
              required: ["candidateId", "score", "matchReasoning"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) return [];
      return JSON.parse(text);

    } catch (error) {
      console.error("Error ranking candidates:", error);
      return [];
    }
  }
};