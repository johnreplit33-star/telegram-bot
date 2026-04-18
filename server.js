const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const express = require("express");

// ====== ENV VARIABLES ======
const TELEGRAM_BOT_TOKEN = process.env."8716497958:AAFk89W8OcSvDi9pWgeRY__HMY9eKuNk21I"
const OPENROUTER_API_KEY = process.env."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"

// ====== CHECK ======
if (!TELEGRAM_BOT_TOKEN || !OPENROUTER_API_KEY) {
  console.error("❌ Missing environment variables");
  process.exit(1);
}

// ====== EXPRESS (Render needs this) ======
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running ✅");
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

// ====== TELEGRAM BOT ======
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  polling: true,
});

console.log("🤖 Telegram bot started...");

// ====== MESSAGE HANDLER ======
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  if (!userMessage) return;

  try {
    // typing indicator
    bot.sendChatAction(chatId, "typing");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-site.com",
        "X-Title": "Telegram Bot",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content || "⚠️ No response from AI";

    bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Error connecting to AI");
  }
});
