import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import ITelegramChatBot from "../../../data/interfaces/ITelegramChatBot";
import Professional from "../../Professional";
import File from "../../../utils/File";

export default class TelegramChatBot implements ITelegramChatBot {
  private professional: Professional;
  private telegramBot: TelegramBot;

  constructor(telegramBot: TelegramBot, professional: Professional) {
    this.professional = professional;
    this.telegramBot = telegramBot;
  }

  inicializeBot(): void {
    this.telegramBot.startPolling({ polling: true });
    console.log("Bot is running...");

    this.telegramBot.on("message", (msg) => this.greetingMessages(msg));
    this.telegramBot.onText(/\/time/, (msg) => this.showFreeTime(msg));
    this.telegramBot.on("callback_query", (callback) =>
      this.handleTimeChoice(callback)
    );
    this.telegramBot.on("polling_error", (msg) => console.log(msg));
  }

  greetingMessages(msg: Message): void {
    const chatId = msg.chat.id;
    File.saveChatMessageCSV(chatId, msg.text!);

    const greeting =
      this.professional.getRandomGreeting() ?? this.getDefaultGreeting();

    this.telegramBot.sendMessage(chatId, greeting);
  }

  showFreeTime(msg: Message): void {
    const chatId = msg.chat.id;
    const inline_keyboard = this.professional.getFreeTime();
    /**
     * TODO: Implementar uma lógica de resposta
     */
    const opt: TelegramBot.SendMessageOptions = {
      reply_to_message_id: msg.message_id,
      reply_markup: { inline_keyboard },
    };

    this.telegramBot.sendMessage(chatId, "Estes sãos os coisos", opt);
  }

  handleTimeChoice(callback: CallbackQuery): void {
    const chatId = callback.from.id;
    const timeChoice = callback.data;
    const response = `Seu atendimento foi marcado para ${timeChoice}`
    // TODO: Implementar lógica de agendamento, onde o horário some da lista ao ser escolhido

    this.telegramBot.sendMessage(chatId, response)

    
  }

  getDefaultGreeting(): string {
    return `
      Olá! Me chamo ${this.professional.getName()}.
      Como posso te ajudar?
    `;
  }
}
