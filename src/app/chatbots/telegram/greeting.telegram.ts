import TelegramBot from "node-telegram-bot-api";
import ProfessionalController from "../../models/professional.model";

function setTelegramGreeting(
  bot: TelegramBot,
  professional: ProfessionalController
) {
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;

    let greeting = professional.getRandomGreeting();

    if (!greeting) {
      greeting = `
        Olá, Boa noite!
        Me chamo, ${professional.getName()}
        Como posso te ajudar?
      `;
    }

    bot.sendMessage(chatId, greeting);
  });
}

export default setTelegramGreeting;