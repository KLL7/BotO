// Pensando que existe uma padronização para os horários de serviço
// ou seja, tais horas durante tais dias, sem mudanças
// {
//  hours: [15, 16, 17, 18, 19, 20], - das 15h as 20h
//  days: [1, 2, 3] - Domingo, Segunda e Terça
// }
interface serviceHours {
  hours: number[];
  days: number[];
}

export default class SchedulingCalendar {
  private serviceHours: serviceHours = {} as serviceHours;

  constructor(serviceHours: serviceHours) {
    this.serviceHours = serviceHours;
  }

  getWeekDayNameByNumber(day: number): string {
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

  getHumanizedWeekDays() {
    const humanizedWeekDays = this.serviceHours.days.map((day) =>
      this.getWeekDayNameByNumber(day)
    );

    return humanizedWeekDays;
  }

  formatNumberToHour(num: number): string {
    let minutes: number | string = (num % 1) * 60;
    let hour: number | string = num - minutes;

    if (hour < 10) hour = hour + "0";
    if (minutes < 10) minutes = minutes + "0";

    return `${hour}:${minutes}`;
  }

  getHumanizedHours() {
    const humanizedHours = this.serviceHours.hours.map((hour) =>
      this.formatNumberToHour(hour)
    );

    return humanizedHours;
  }

  createHumanizedCalendar(): string[][] {
    const days = this.getHumanizedWeekDays();
    const hours = this.getHumanizedHours();
    const humanizedCalendar = [];

    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const currentWeek = [];

      for (let j = 0; j < hours.length; j++) {
        const hour = hours[j];

        const finalHour = `${day} às ${hour}`;
        currentWeek.push(finalHour);
      }

      humanizedCalendar.push(currentWeek);
    }

    return humanizedCalendar;
  }

  getServiceHours(): serviceHours {
    return this.serviceHours;
  }

  setServiceHours(serviceHours: serviceHours) {
    this.serviceHours = serviceHours;
  }
}
