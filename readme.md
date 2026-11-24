# AI Model Playground

An Express and LangChain playground that uses Google's Gemini model to answer chat messages and provide a sample restaurant menu through a tool-calling agent.

## Features

- Gemini 3.5 Flash chat responses
- LangChain tool-calling agent
- Restaurant menu tool for breakfast, lunch, and dinner
- JSON chat API
- Static web interface

## Requirements

- Node.js
- A Google Gemini API key

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root and add:

   ```env
   GOOGLE_API_KEY=your_google_api_key
   ```

3. Start the server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:5000` in your browser.

## Chat API

Send a JSON POST request to `/api/chat`:

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"input\":\"What is on the lunch menu?\"}"
```

Example response:

```json
{
  "output": "Today's lunch menu: Dal, Rice, Roti, Vegetable curry"
}
```

## Project Structure

- `server.js` - Express server, Gemini model, agent, and menu tool
- `public/index.html` - Browser interface
- `.env` - API key configuration