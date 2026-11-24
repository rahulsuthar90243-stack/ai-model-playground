import express from "express"
import "dotenv/config"


import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentExecutor, createToolCallingAgent } from "@langchain/classic/agents";
import { DynamicStructuredTool } from "langchain";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import path from "path"
import { z } from "zod"

const port = 5000;
const app = express();
app.use(express.json());

const _dirname = path.resolve();


const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash",
    maxOutputTokens: 2048,
    temperature: 0.7,
    apiKey: process.env.GOOGLE_API_KEY,
})

//tool: restaurent menu tool
const getMenutool = new DynamicStructuredTool({
    name: "getMenuTool",
    description: "Returns the final answer for today's menu for the given catagory (brackfast, lunch, or dinner). use this tools to directly anser the user's menu question.",
    schema: z.object({
        category: z.enum(["breakfast", "lunch", "dinner"]).describe("Type of meal"),
    }),

    func: async ({ category }) => {
        const menus = {
            breakfast: ["Poha", "Idli", "Tea"],
            lunch: ["Dal", "Rice", "Roti", "Vegetable curry"],
            dinner: ["Soup", "Paneer curry", "Roti", "Salad"],
        }

        return `Today's ${category} menu: ${menus[category].join(", ")}`
    }
})

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful AI assistant that uses tools when needed."],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = await createToolCallingAgent({
  llm: model,
  tools: [getMenutool],
  verbose: true,
  maxIterations: 5,
  prompt,
});

const executor = new AgentExecutor({
  agent,
  tools: [getMenutool],
});

app.post("/api/chat", async (req, res) => {
    const userInput = req.body.input;
    console.log("userInput: ", userInput);

    try {
        const response = await executor.invoke({input: userInput});
        console.log("Agent response: ", response);
        if(response.output){
            return res.json({output: response.output})
        }
    } catch (error) {
        console.log("Error during agent execution: ", error)
        res.status(500).json({
            output: "Sorry, something went wrong. Please try again"
        })
    }
})

app.get("/", (req, res) => {
   res.sendFile(path.join(_dirname, "public", "index.html"));
})

app.listen(port, () => {
    console.log(`server is running on port http:/localhost:${port}`);
})