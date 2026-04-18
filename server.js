const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const express = require("express");

// ===== ENV VARIABLES =====
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;


if (!TELEGRAM_BOT_TOKEN || !OPENROUTER_API_KEY) {
  console.error("❌ Missing environment variables");
  process.exit(1);
}

// ===== EXPRESS SERVER (Render needs this) =====
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running ✅");
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

// ===== TELEGRAM BOT =====
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  polling: true,
});

console.log("🤖 Bot started...");

// ===== MESSAGE HANDLER =====
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  if (!userMessage) return;

  try {
    await bot.sendChatAction(chatId, "typing");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            { role: "user", content: userMessage }
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "⚠️ AI did not return a response";

    bot.sendMessage(chatId, reply);

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Error connecting to AI");
  }
});
