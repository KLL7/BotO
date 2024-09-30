import { Message } from "node-telegram-bot-api";

export default interface ITelegramChatBot {
  inicializeBot(): void;
  greetingMessages(msg: Message): void;
  saveChatMessageCSV(chatId: number, message: string): void;
  getDefaultGreeting(): string;
}
