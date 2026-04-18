const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔴 REPLACE THIS WITH YOUR REAL BOT TOKEN
const TOKEN = "8716497958:AAEtNR901aQ5Eh_toZD6FSBboCmhl8JJjIo";

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

app.post("/webhook", async (req, res) => {
  const message = req.body.message;

  if (message) {
    const chatId = message.chat.id;
    const text = message.text;

    let reply = "I don't understand 🤖";

    if (text === "/start") {
      reply = "✅ Bot is working!";
    } else {
      reply = "You said: " + text;
    }

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: reply,
    });
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
