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
  "Olá! Sou da área de aprimoramento de espelhos quebrados. Estou aqui para te ajudar.",
  "Oi, tudo bem? Estou aqui para poder te atender, como posso te chamar?",
  "Oi, tudo bem? Sou o João Alberto. Estou aqui para te ajudar. Como posso te ajudar?",
  "Essa é mais uma mensagem de teste de saudação.",
  "Manda a braba",
  "Murilo Gomes Bot ao seu dispor.",
]);

const chatBot = new TelegramChatBot(bot, testProfessional);

chatBot.inicializeBot();

