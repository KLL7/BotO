import { CHAT_FILE_DIR_PATH, CHAT_FILE_PATH } from "../data/constants/paths";
import { existsSync, mkdirSync } from "fs";
import { appendFile, writeFile } from "fs/promises";

export default class File {
  static saveChatMessageCSV(chatId: number, message: string): void {
    const newMessage = this.formatMessageToCSV(message);
    const messageData = `${chatId},${newMessage}\n`;
    
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

  static formatMessageToCSV(message: string) {
    return message.replace(/,/g, " ").trim();
  }
}
