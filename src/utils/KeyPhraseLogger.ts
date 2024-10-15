import * as fs from "fs";
import * as path from "path";
import TelegramBot from "node-telegram-bot-api";

export default class KeyPhraseLogger {
  private keyPhrases: string[];
  private logs: string[];

  constructor(keyPhrases: string[]) {
    this.keyPhrases = keyPhrases;
    this.logs = [];
  }

  detectAndSave(text: string, chatId: number) {
    const normalizedText = text.toLowerCase();
    const timestamp = new Date().toISOString().replace(/:/g, "-");

    this.keyPhrases.forEach((phrase) => {
      if (normalizedText.includes(phrase.toLowerCase())) {
        const logMessage = `[${timestamp}] Fase de testes para relatório: Objetivo detectado: "${phrase}" na conversa do chatId ${chatId}.\n.`;
        this.logs.push(logMessage);
      }
    });
  }
  generateReport(chatId: number, bot: TelegramBot) {
    if (this.logs.length > 0) {
      const directoryPath = path.join(__dirname, "../../TestLogger");

      if (!fs.existsSync(directoryPath)) {
        console.log("Diretório não existe, criando novo diretório...");
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      const fileTimestamp = new Date().toISOString().replace(/:/g, "-");
      const filePath = path.join(
        directoryPath,
        `chat_${chatId}_${fileTimestamp}.txt`
      );

      fs.writeFileSync(filePath, this.logs.join(""), "utf8");
      console.log(`Relatório gerado em: ${filePath}`);

      this.sendReport(filePath, chatId, bot);
    } else {
      console.log("Nenhum log detectado, relatório não será gerado.");
    }
  }

  private sendReport(filePath: string, chatId: number, bot: TelegramBot) {
    console.log(`Enviando o arquivo ${filePath} para o chatId ${chatId}.`);

    bot.sendDocument(chatId, filePath).catch((err) => {
      console.error("Erro ao enviar o arquivo:", err);
    });
  }
}
