import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//servir frontend
app.use("/", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Instancia de openai pasandole el api key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let userThreads = {};

app.post("/api/chatbot", async (req, res) => {
  const { userId, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    if (!userThreads[userId]) {
      const thread = await openai.beta.threads.create();
      userThreads[userId] = thread.id;
    }

    const threadId = userThreads[userId];

    //*Añadido el mensaje al hilo del asistente
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    const myAssistant = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.ASSISTANT_ID,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
