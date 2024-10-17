export default class Customer {
  private name: string;
  private number: string;
  private chatId: number;
  private appointment: string[] = [];

  constructor(name: string, number: string, chatId: number) {
    this.name = name;
    this.number = number;
    this.chatId = chatId;
  }
  
  getChatId(): number {
    return this.chatId;
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

  setChatId(chatId: number) {
    this.chatId = chatId;
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
