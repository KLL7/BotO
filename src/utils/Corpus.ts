import rl from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import File from "./File";
import { CORPUS_DIR_PATH } from "../data/constants/paths";

export default class Corpus {
  private static readline = rl.createInterface({ input, output });

  static async insertGreetingFromTerminal(): Promise<void> {
    console.log('Insert your greetings (enter "quit" to exit)): ');

    while (true) {
      const message = await this.readline.question("> ");

      if (message == "quit") break;

      File.saveToTXT("greetings-corpus", message);
    }

    console.log("Done!");
    process.exitCode = 1;
  }

  static insertGreeting(message: string): void {
    File.saveToTXT("greetings-corpus", message);
  }

  static async getGreetingCorpus(): Promise<string[]> {
    return await File.arrayFromFileContentLines(
      `${CORPUS_DIR_PATH}/greetings-corpus.txt`
    );
  }
}
