import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

// 🔑 ENV VARIABLES (set these in Render)
const TELEGRAM_TOKEN = process.env.8716497958:AAFk89W8OcSvDi9pWgeRY__HMY9eKuNk21I;
const OPENROUTER_API_KEY = process.env.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;

if (!TELEGRAM_TOKEN || !OPENROUTER_API_KEY) {
  console.error("Missing API keys!");
  process.exit(1);
}

// 🤖 Start bot (polling)
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

console.log("Bot started...");

// 💬 When user sends message
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  if (!userText) return;

  try {
    // 🧠 Call OpenRouter AI
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: userText }
        ]
      })
    });

    const data = await response.json();

    console.log("AI response:", data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      "⚠️ AI failed to respond.";

    bot.sendMessage(chatId, reply);

  } catch (error) {
    console.error("Error:", error.message);
    bot.sendMessage(chatId, "❌ Error talking to AI.");
  }
});
