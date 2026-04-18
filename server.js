const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  let reply = "I don't understand 🤖";

  if (msg.text === "/start") {
    reply = "✅ Bot is working!";
  }

  bot.sendMessage(chatId, reply);
});

console.log("Bot is running...");
