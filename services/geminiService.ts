// Fix: Implemented the geminiService to interact with the Google Gemini API.
import { GoogleGenAI, Type } from "@google/genai";

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  /**
   * Parses user-provided text to identify medical conditions.
   * @param userInfo A string containing the user's medical information.
   * @returns A promise that resolves to an array of identified conditions.
   */
  async parseConditions(userInfo: string): Promise<string[]> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Extract the key medical conditions from the following text. List only the names of the conditions. Text: "${userInfo}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              conditions: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                  description: "A medical condition identified from the text.",
                },
              },
            },
            required: ["conditions"],
          },
        },
      });

      const jsonString = response.text.trim();
      const parsed = JSON.parse(jsonString);
      return parsed.conditions || [];
    } catch (error) {
      console.error("Error parsing conditions with Gemini:", error);
      return [];
    }
  }

  /**
   * Generates a patient-friendly summary of a medical text.
   * @param text The medical text to summarize (e.g., from a clinical trial or publication).
   * @returns A promise that resolves to a simplified summary string.
   */
  async getSummary(text: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Summarize the following medical text in simple, easy-to-understand language for a patient. Text: "${text}"`,
        config: {
          systemInstruction: "You are a helpful assistant who explains complex medical topics to patients in a clear and concise way.",
        },
      });
      return response.text;
    } catch (error) {
      console.error("Error generating summary with Gemini:", error);
      return "Sorry, we were unable to generate a summary at this time.";
    }
  }

  /**
   * Generates a personalized matching report for a clinical trial.
   * @param patientInfo The patient's medical information.
   * @param trialInfo The clinical trial information.
   * @returns A promise that resolves to a markdown string explaining the match.
   */
  async generateTrialMatchReport(patientInfo: string, trialInfo: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `A patient has the following medical profile:\n\n${patientInfo}\n\nAnalyze the following clinical trial and explain why it might be a good match for this patient. Focus on the condition, key eligibility criteria, and treatment type. Present the explanation clearly in markdown.\n\nClinical Trial:\n${trialInfo}`,
        config: {
            systemInstruction: "You are an AI assistant helping patients understand clinical trials. Your tone should be informative and encouraging, but you must include a disclaimer that this is not medical advice and they should consult their doctor."
        }
      });
      return response.text;
    } catch (error) {
      console.error("Error generating trial match report:", error);
      return "Could not generate a match report at this time.";
    }
  }
}

export const geminiService = new GeminiService();
