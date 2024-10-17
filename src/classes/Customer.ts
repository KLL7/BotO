import { serviceTime } from "./SchedulingCalendar";

export default class Customer {
  private name: string;
  private number: string;
  private chatId: number;
  private appointment: { serviceTime: serviceTime; humanizedDate: string }[] =
    [];

  constructor(name: string, number: string, chatId: number) {
    this.name = name;
    this.number = number;
    this.chatId = chatId;
  }

  getChatId(): number {
    return this.chatId;
  }

  getAppointment(): { serviceTime: serviceTime; humanizedDate: string }[] {
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

  setAppointment(
    appointment: { serviceTime: serviceTime; humanizedDate: string }[]
  ) {
    this.appointment = appointment;
  }

  setName(name: string) {
    this.name = name;
  }

  setNumber(number: string) {
    this.number = number;
  }
}
