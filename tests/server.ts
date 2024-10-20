import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import Professional from "../src/classes/Professional";
import TelegramChatBot from "../src/classes/bot/telegram/TelegramChatBot";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {});
const testProfessional = new Professional(
  "João Alberto",
  "joãoalberto@test.me"
);

testProfessional.setGreetings([
  "Olá! Pode falar o que precisa. Estou aqui para te ajudar.",
  "Oi, tudo bem? Estou aqui para poder te atender, como posso te chamar?",
  "Opa! Como posso te ajudar?",
  "Opa, tudo bem? Como posso te ajudar?",
]);

testProfessional.setSchedulingCalendar({
  hours: [15, 16, 17, 18, 19, 20],
  days: [1, 2, 3],
});

const chatBot = new TelegramChatBot(bot, testProfessional);

chatBot.inicializeBot();
