const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.8716497958:AAFk89W8OcSvDi9pWgeRY__HMY9eKuNk21I, {
  polling: true
});

const OPENROUTER_API_KEY = process.env.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;

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: text }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    bot.sendMessage(chatId, reply);

  } catch (err) {
    console.log(err.response?.data || err.message);
    bot.sendMessage(chatId, "AI error 😢");
  }
});
