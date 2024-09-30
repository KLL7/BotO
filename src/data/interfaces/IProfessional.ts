import { DaysOfTheWeek } from "../types/Date";

export default interface IProfessional {
  getRandomGreeting(): string;
  getName(): string;
  getEmail(): string;
  setServiceDays(serviceDays: DaysOfTheWeek): void;
  setServiceHours(serviceDays: Date[]): void;
  // TODO: Adicionar um meio de manipular os horários, talvez retornar um objeto.
  computeServiceTime(): Date[];
  getFreeServiceTime(): string;
}
