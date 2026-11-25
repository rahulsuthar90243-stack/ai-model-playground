import { config } from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LLMChain } from "@langchain/classic/chains";
import { PromptTemplate } from "@langchain/core/prompts";

config();

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is missing. Add it to the .env file.");
}

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  maxOutputTokens: 2048,
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
});

const prompt = PromptTemplate.fromTemplate(
  "Explain the concept of {topic} to a beginner."
);

const chain = new LLMChain({
  llm: model,
  prompt,
});

const response = await chain.run("quantum computing");

console.log("Gemini Response:\n", response);