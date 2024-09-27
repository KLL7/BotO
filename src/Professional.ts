import IProfessional from "./data/interfaces/IProfessional";

export default class Professional implements IProfessional {
  private greetings: string[] = [];
  private name: string;
  private email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  getRandomGreeting(): string {
    const randomIndexFromGreetingsLength = Math.floor(
      Math.random() * this.greetings.length
    );
    return this.greetings[randomIndexFromGreetingsLength];
  }
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }
  setGreetings(greetings: string[]) {
    this.greetings = greetings;
  }
}
