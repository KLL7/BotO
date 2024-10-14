import * as fs from "fs";
import * as path from "path";

export default class KeyPhraseLogger {
  private keyPhrases: string[];

  constructor(keyPhrases: string[]) {
    this.keyPhrases = keyPhrases;
  }

  detectAndSave(text: string, chatId: number) {
    this.keyPhrases.forEach((phrase) => {
      if (text.includes(phrase)) {
        const logMensage = `Fase de testes para p relatório: Frase-chave detectada: "${phrase}" na conversa do chatId ${chatId}.\n.`;
        this.saveLog(logMensage);
      }
    });
  }

  private saveLog(content: string): void {
    const directoryPath = path.join(__dirname, "../../TestLogger");

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const filePath = path.join(directoryPath, `chat_${new Date().toISOString()}.txt`);

    fs.appendFileSync(filePath, content, "utf-8");
  }
}
