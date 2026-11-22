import "dotenv/config"
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing. Add it to the .env file.");
}

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
});

const response = await model.invoke([new HumanMessage("Hello world!")]);

console.log(response.content);