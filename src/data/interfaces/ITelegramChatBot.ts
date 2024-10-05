import { CallbackQuery, Message } from "node-telegram-bot-api";

export default interface ITelegramChatBot {
  inicializeBot(): void;
  greetingMessages(msg: Message): void;
  showFreeTime(msg: Message): void;
  getDefaultGreeting(): string;
  handleTimeChoice(callback: CallbackQuery): void
}
