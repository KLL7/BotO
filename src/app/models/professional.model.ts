import IProfessionalModel from "../interfaces/professional.model.interface";

export default class ProfessionalModel implements IProfessionalModel {
  private name: string;
  private greetings: string[] = [];
  private freeHours: string[] = [];
  private freeDays: string[] = [];
  private email: string;
  private number: string;

  constructor(name: string, number: string, email: string) {
    this.name = name;
    this.email = email;
    this.number = number;
  }
  getRandomGreeting(): string {
    const randomIndexBasedOnLength = Math.floor(
      Math.random() * this.greetings.length
    );
    return this.greetings[randomIndexBasedOnLength];
  }

  getName(): string {
    return this.name;
  }

  getNumber(): string {
    return this.number;
  }

  getEmail(): string {
    return this.email;
  }

  getGreetings(): string[] {
    return this.greetings;
  }

  getFreeHours(): string[] {
    return this.freeHours;
  }

  getFreeDays(): string[] {
    return this.freeDays;
  }
  
  getFreeTime(): string[] {
    // TODO: Implemantar um algoritmo para retornar o horário livre
    // baseado nos dias livres, horas livres e do que já foi preenchido
    throw new Error("Method not implemented.");
  }
  // Setters para configuração após o cadrastro, ou algo assim.
  setGreetings(newGreetings: string[]): void {
    this.greetings = newGreetings;
  }
  setFreeHours(newFreeHours: string[]): void {
    this.freeHours = newFreeHours;
  }
  setFreeDays(newFreeDays: string[]): void {
    this.freeDays = newFreeDays;
  }
}
