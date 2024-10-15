import IProfessional from "../data/interfaces/IProfessional";
import SchedulingCalendar, { rawServiceHours } from "./SchedulingCalendar";

export default class Professional implements IProfessional {
  private greetings: string[] = [];
  private name: string;
  private email: string;
  private schedulingCalendar: SchedulingCalendar = SchedulingCalendar.create(
    {} as rawServiceHours
  );

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  getSchedulingCalendar() {
    return this.schedulingCalendar;
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

  setSchedulingCalendar(rawServiceHours: rawServiceHours) {
    this.schedulingCalendar = SchedulingCalendar.create(rawServiceHours);
  }
}
