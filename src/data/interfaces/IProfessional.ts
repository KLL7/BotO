export default interface IProfessional {
  getRandomGreeting(): string;
  getName(): string;
  getEmail(): string;
  getFreeTime(): {text: string, callback_data: string}[][];
}
