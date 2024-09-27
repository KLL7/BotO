import TelegramBot from "node-telegram-bot-api";
import setTelegramGreeting from "./greeting.telegram";
import ProfessionalModel from "../../models/professional.model";
import "dotenv/config";

const telBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  polling: true,
});

setTelegramGreeting(
  telBot,
  new ProfessionalModel("José Bonifácio", "(88) 99999-999", "jose.bonifacio@boto.com.br")
);

export default telBot;