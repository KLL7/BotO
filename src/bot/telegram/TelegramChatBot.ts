import TelegramBot, { Message } from "node-telegram-bot-api";
import ITelegramChatBot from "../../data/interfaces/ITelegramChatBot";
import Professional from "../../Professional";
import { writeFile, appendFile } from "fs/promises";
import { mkdirSync, existsSync } from "fs";
import { CHAT_FILE_DIR_PATH, CHAT_FILE_PATH } from "../../data/constants/paths";

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
  }

  greetingMessages(msg: Message): void {
    const chatId = msg.chat.id;

    const greeting =
      this.professional.getRandomGreeting() ?? this.getDefaultGreeting();

    this.saveChatMessageCSV(chatId, msg.text!);
    this.telegramBot.sendMessage(chatId, greeting);
  }
  
  saveChatMessageCSV(chatId: number, message: string): void {
    const newMessage = this.formatMessageToCSV(message);
    const messageData = `${chatId},${newMessage}\n`;
    console.log({messageData});
    console.log({message});
    if (!existsSync(CHAT_FILE_DIR_PATH)) {
      console.log("Creating chat directory...");
      mkdirSync(CHAT_FILE_DIR_PATH);
    }

    if (existsSync(CHAT_FILE_PATH)) {
      appendFile(CHAT_FILE_PATH, messageData);
    }

    if (!existsSync(CHAT_FILE_PATH)) {
      const headers = "chatId,message\n";
      writeFile(CHAT_FILE_PATH, headers + messageData);
    }
  }

  getDefaultGreeting(): string {
    return `
      Olá! Me chamo ${this.professional.getName()}.
      Como posso te ajudar?
    `;
  }

  formatMessageToCSV(message: string) {
    return message.replace(/,/g, ' ').trim();
  }
}
