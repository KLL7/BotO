// Pensando que existe uma padronização para os horários de serviço
// ou seja, tais horas durante tais dias, sem mudanças
// {
//  hours: [15, 16, 17, 18, 19, 20], - das 15h as 20h
//  days: [1, 2, 3] - Domingo, Segunda e Terça
// }

export interface serviceTime {
  hour: number;
  day: number;
  isAvailable: boolean;
  //TODO: add customer logic here, like an object or something else
  customer?: string;
}

export type rawServiceHours = {
  hours: Array<number>;
  days: Array<number>;
};

export default class SchedulingCalendar {
  private rawServiceHours = {} as rawServiceHours;
  private serviceTimes: serviceTime[] = [];
  private appointments: serviceTime[] = [];

  constructor(rawServiceHours: any) {
    this.rawServiceHours = rawServiceHours;
  }

  initializeServiceTimes() {
    this.serviceTimes = this.createServiceTimes(this.rawServiceHours);
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

  scheduleServiceTime(serviceTime: serviceTime, customer = "") {
    const serviceTimeIndex = this.serviceTimes.indexOf(serviceTime);

    if (!this.serviceTimes[serviceTimeIndex].isAvailable) return;

    this.serviceTimes[serviceTimeIndex].isAvailable = false;

    const scheduleAServiceTime = {
      ...serviceTime,
      customer,
    };

    this.appointments.push(scheduleAServiceTime);
  }

  unscheduleAppointment(appointment: serviceTime) {
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
  }

  private getWeekDayNameByNumber(day: number): string {
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

  private getHumanizedWeekDays() {
    const humanizedWeekDays = this.rawServiceHours.days.map((day) =>
      this.getWeekDayNameByNumber(day)
    );

    return humanizedWeekDays;
  }

  private formatNumberToHour(num: number): string {
    let minutes: number | string = (num % 1) * 60;
    let hour: number | string = num - minutes;

    if (hour < 10) hour = hour + "0";
    if (minutes < 10) minutes = minutes + "0";

    return `${hour}:${minutes}`;
  }

  private getHumanizedHours() {
    const humanizedHours = this.rawServiceHours.hours.map((hour) =>
      this.formatNumberToHour(hour)
    );

    return humanizedHours;
  }

  createHumanizedCalendar(): string[][] {
    const days = this.getHumanizedWeekDays();
    const hours = this.getHumanizedHours();
    const humanizedCalendar = [];

    for (const day of days) {
      const currentWeek = [];

      for (const hour of hours) {
        const finalHour = `${day} às ${hour}`;
        currentWeek.push(finalHour);
      }

      humanizedCalendar.push(currentWeek);
    }

    return humanizedCalendar;
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
