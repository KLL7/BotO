export default interface IProfessionalModel {
  getName(): string;
  getGreetings(): string[];
  getFreeHours(): string[];
  getFreeDays(): string[];
  getFreeTime(): string[];
  getRandomGreeting(): string;

  setGreetings(newGreetings: string[]): void;
  setFreeHours(newFreeHours: string[]): void;
  setFreeDays(newFreeDays: string[]): void;
}