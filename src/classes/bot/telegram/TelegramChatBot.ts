import TelegramBot, { Message } from "node-telegram-bot-api";
import Professional from "../../Professional";
import ChatBot from "../ChatBot";

export default class TelegramChatBot extends ChatBot {
  private telegramBot: TelegramBot;

  constructor(telegramBot: TelegramBot, professional: Professional) {
    super(professional);
    this.telegramBot = telegramBot;
  }

  inicializeBot(): void {
    this.telegramBot.startPolling({ polling: true });

    console.log("Bot is running...");

    this.telegramBot.on("message", this.handleMessage);
  }

  async handleMessage(msg: Message): Promise<void> {
    const response = await super.analyzeMessage(msg.text!);

    if (!response) {
      const textMessage = "Desculpe, ainda estou treinando para entender isso.";

      this.sendMessage(msg, textMessage);
    }

    this.sendMessage(msg, response!);
  }

  greetingMessages(msg: Message): void {
    const chatId = msg.chat.id;

    const greeting =
      super.getProfessional().getRandomGreeting() ?? this.getDefaultGreeting();

    this.telegramBot.sendMessage(chatId, greeting);
  }

  sendMessage(msg: Message, text: string): void {
    const chatId = msg.chat.id;

    if (!text)
      text = "Opa! Ainda estou aprendendo a entender isso, tente outra coisa";

    this.telegramBot.sendMessage(chatId, text);
  }

  getDefaultGreeting(): string {
    return `
      Olá! Me chamo ${super.getProfessional().getName()}.
      Como posso te ajudar?
    `;
  }
}
