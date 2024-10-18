import File from "./File";
import { CORPUS_DIR_PATH } from "../data/constants/paths";

export default class Corpus {

  static insertGreeting(message: string): void {
    File.saveToTXT("greetings-corpus", message);
  }

  static insertAppointment(message: string): void {
    File.saveToTXT("appointments-corpus", message);
  }

  static insertHoursAppointment(message: string): void {
    File.saveToTXT("appointments-corpus", message);
  }

  static async getGreetingCorpus(): Promise<string[]> {
    return await File.arrayFromFileContentLines(
      `${CORPUS_DIR_PATH}/greetings-corpus.txt`
    );
  }
  static async getAppointmentsCorpus(): Promise<string[]> {
    return await File.arrayFromFileContentLines(
      `${CORPUS_DIR_PATH}/appointments-corpus.txt`
    );
  }

  static async getHoursAppointment(): Promise<string[]> {
    return await File.arrayFromFileContentLines(
      `${CORPUS_DIR_PATH}/hours-appointment-corpus.txt`
    );
  }
}
