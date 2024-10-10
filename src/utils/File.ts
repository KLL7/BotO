import {
  CHAT_FILE_DIR_PATH,
  CHAT_FILE_PATH,
  CORPUS_DIR_PATH,
} from "../data/constants/paths";
import { existsSync, mkdirSync } from "fs";
import { appendFile, writeFile, readFile } from "fs/promises";

export default class File {
  static saveChatMessageCSV(message: string, messageType: string): void {
    const newMessage = this.formatMessageToCSV(message);
    const messageData = `${newMessage},${messageType}\n`;

    if (!existsSync(CHAT_FILE_DIR_PATH)) {
      console.log("Creating chat directory...");
      mkdirSync(CHAT_FILE_DIR_PATH);
    }

    if (existsSync(CHAT_FILE_PATH)) {
      appendFile(CHAT_FILE_PATH, messageData);
    }

    if (!existsSync(CHAT_FILE_PATH)) {
      const headers = "chatId,message,type\n";
      writeFile(CHAT_FILE_PATH, headers + messageData);
    }
  }

  static formatMessageToCSV(message: string) {
    return message.replace(/,/g, " ").trim();
  }

  static saveToTXT(
    fileName: string,
    text: string,
    path: string = CORPUS_DIR_PATH
  ): void {
    const finalPath = `${path}/${fileName}.txt`;
    const finalText = `${text}\n`;

    if (!existsSync(path)) {
      console.log(`creating ${path.split("/").pop()} directory`);
      mkdirSync(path);
    }

    if (!existsSync(finalPath)) {
      writeFile(finalPath, finalText);
    }

    if (existsSync(finalPath)) {
      appendFile(finalPath, finalText);
    }
  }
  
  static async arrayFromFileContentLines(path: string) {
    const content = await readFile(path, "utf-8");

    return content.split("\n");
  }

}
