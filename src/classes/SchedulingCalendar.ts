// Pensando que existe uma padronização para os horários de serviço
// ou seja, tais horas durante tais dias, sem mudanças
// {
//  hours: [15, 16, 17, 18, 19, 20], - das 15h as 20h
//  days: [1, 2, 3] - Domingo, Segunda e Terça
// }

import Customer from "./Customer";

export interface serviceTime {
  hour: number;
  day: number;
  isAvailable: boolean;
  customer?: Customer;
}

export type rawServiceHours = {
  hours: Array<number>;
  days: Array<number>;
};

export default class SchedulingCalendar {
  private rawServiceHours = {} as rawServiceHours;
  private serviceTimes: serviceTime[] = [];
  private appointments: serviceTime[] = [];

  private constructor(rawServiceHours: any) {
    this.rawServiceHours = rawServiceHours;
  }

  static create(rawServiceHours: rawServiceHours) {
    const schedulingCalendar = new SchedulingCalendar(rawServiceHours);

    schedulingCalendar.initializeServiceTimes();

    return schedulingCalendar;
  }

  initializeServiceTimes() {
    this.serviceTimes = this.createServiceTimes(this.rawServiceHours);
  }

  scheduleServiceTime(serviceTime: serviceTime, customer: Customer) {
    const serviceTimeIndex = this.serviceTimes.findIndex(
      (serviceTimeElement) =>
        serviceTimeElement.hour === serviceTime.hour &&
        serviceTimeElement.day === serviceTime.day
    );

    if (!this.serviceTimes[serviceTimeIndex].isAvailable) return;

    this.serviceTimes[serviceTimeIndex].isAvailable = false;

    const scheduleAServiceTime = {
      ...serviceTime,
      customer,
    };

    this.appointments.push(scheduleAServiceTime);
  }

  unscheduleAppointment(appointment: serviceTime, customer: Customer) {
    const appointmentIndex = this.appointments.indexOf(appointment);
    this.appointments.splice(appointmentIndex, 1);

    const { day, hour } = appointment;

    for (let i = 0; i < this.serviceTimes.length; i++) {
      if (
        this.serviceTimes[i].day === day &&
        this.serviceTimes[i].hour === hour
      ) {
        this.serviceTimes[i].isAvailable = true;
      }
    }

    customer.setAppointment([]);
  }

  private createServiceTimes(rawServiceHours: rawServiceHours): serviceTime[] {
    const serviceTimes: serviceTime[] = [];

    for (const i in rawServiceHours.days) {
      const day = rawServiceHours.days[i];
      for (const j in rawServiceHours.hours) {
        const hour = rawServiceHours.hours[j];

        const serviceTime = {
          hour,
          day,
          isAvailable: true,
        };

        serviceTimes.push(serviceTime);
      }
    }

    return serviceTimes;
  }

  private static getWeekDayNameByNumber(day: number): string {
    switch (day) {
      case 1:
        return "Domingo";
      case 2:
        return "Segunda-Feria";
      case 3:
        return "Terça-Feira";
      case 4:
        return "Quarta-Feira";
      case 5:
        return "Quinta-Feira";
      case 6:
        return "Sexta-Feira";
      case 7:
        return "Sábado";
      default:
        return "";
    }
  }

  private static formatNumberToHour(num: number): string {
    let minutes: number | string = (num % 1) * 60;
    let hour: number | string = num - minutes;

    if (hour < 10) hour = hour + "0";
    if (minutes < 10) minutes = minutes + "0";

    return `${hour}:${minutes}`;
  }

  static createHumanizedCalendarFromServiceTime(serviceTime: serviceTime): string {
    const { day, hour } = serviceTime;
    const weekDay = this.getWeekDayNameByNumber(day);

    return `${weekDay} às ${this.formatNumberToHour(hour)}`;
  }

  getAvailableServiceTime() {
    const availableServiceTimes = this.serviceTimes.filter(
      (serviceTime) => serviceTime.isAvailable
    );

    return availableServiceTimes;
  }

  getRawServiceHours(): rawServiceHours {
    return this.rawServiceHours;
  }

  setRawServiceHours(rawServiceHours: rawServiceHours) {
    this.rawServiceHours = rawServiceHours;
  }

  getServiceTimes(): serviceTime[] {
    return this.serviceTimes;
  }

  getAppointments(): serviceTime[] {
    return this.appointments;
  }
}
