const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// 🔑 PUT YOUR TOKENS HERE
const TELEGRAM_TOKEN = "8716497958:AAFk89W8OcSvDi9pWgeRY__HMY9eKuNk21I";
const OPENROUTER_API_KEY = "sk-or-v1-49555211357413c987ac88b3e9d3b90903ee610a7e0cde5032b683cfc8935d04x";

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: userText }],
      },
      {
        headers: {
  "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://your-site.com",
  "X-Title": "Telegram Bot",
}
      }
    );

    const reply = response.data.choices[0].message.content;

    bot.sendMessage(chatId, reply);

  } catch (error) {
    console.log(error.response?.data || error.message);
    bot.sendMessage(chatId, "Error connecting to AI");
  }
});

console.log("Bot is running...");
