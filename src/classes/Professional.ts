import IProfessional from "../data/interfaces/IProfessional";

export default class Professional implements IProfessional {
  private greetings: string[] = [];
  private name: string;
  private email: string;
  private freeDays: string[] = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  private freeHours: string[] = ["15:00", "18:00", "19:00", "20:00"];

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

  getFreeTime(): { text: string; callback_data: string }[][] {
    const freeTime = this.freeDays.map((day) =>
      this.freeHours.map((hour) => {
        const text = day + " às " + hour + " horas";

        return { text, callback_data: text };
      })
    );

    return freeTime;
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
