export default class Customer {
  private name: string;
  private number: string;
  private appointment: string[] = [];

  constructor(name: string, number: string) {
    this.name = name;
    this.number = number;
  }

  getAppointment(): string[] {
    return this.appointment;
  }

  getName(): string {
    return this.name;
  }

  getNumber(): string {
    return this.number;
  }

  setAppointment(appointment: string[]) {
    this.appointment = appointment;
  }

  setName(name: string) {
    this.name = name;
  }

  setNumber(number: string) {
    this.number = number;
  }
}
