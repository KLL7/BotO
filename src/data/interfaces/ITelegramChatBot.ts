import { Message } from "node-telegram-bot-api";

export default interface ITelegramChatBot {
  inicializeBot(): void;
  greetingMessages(msg: Message): void;
  saveChatMessageJSON(chatId: number, message: string): void;
  getDefaultGreeting(): string;
}
