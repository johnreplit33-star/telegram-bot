const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

// 🔐 Get token from Render environment
const token = process.env.BOT_TOKEN;

// ❌ Stop app if token is missing
if (!token) {
  console.error("❌ BOT_TOKEN is missing! Add it in Render environment variables.");
  process.exit(1);
}

// 🤖 Create bot (polling mode)
const bot = new TelegramBot(token, { polling: true });

// 💬 Handle messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  let reply = "I don't understand 🤖";

  if (msg.text === "/start") {
    reply = "✅ Bot is working!";
  }

  bot.sendMessage(chatId, reply);
});

// 🌐 Web server (REQUIRED for Render)
app.get('/', (req, res) => {
  res.send('Bot is running 🚀');
});

// 🔊 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
