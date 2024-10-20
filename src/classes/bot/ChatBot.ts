import Corpus from "../../utils/Corpus";
import CosineSimilarity from "../../utils/CosineSimilarity";
import File from "../../utils/File";
import Customer from "../Customer";
import Professional from "../Professional";
import SchedulingCalendar, { serviceTime } from "../SchedulingCalendar";

type messageType =
  | "greeting"
  | "appointment/scheduling"
  | "hours-appointment/scheduling";

export default class ChatBot {
  private professional: Professional;
  private cutOff = 0.4;

  constructor(professional: Professional) {
    this.professional = professional;
  }

  private createAppointmentsToUseOnMessage() {
    const schedulingCalendar = this.professional.getSchedulingCalendar();

    const availableServiceTimes = schedulingCalendar.getAvailableServiceTime();

    const appointmentsToUseOnMessage = availableServiceTimes.map(
      (serviceTime) => {
        const humanizedDate =
          SchedulingCalendar.createHumanizedCalendarFromServiceTime(
            serviceTime
          );

        return {
          serviceTime,
          humanizedDate,
        };
      }
    );

    return appointmentsToUseOnMessage;
  }

  getDefaultGreeting(): string {
    return `
      Olá! Me chamo ${this.getProfessional().getName()}.
      Como posso te ajudar?
    `;
  }

  getProfessional() {
    return this.professional;
  }

  handleAppointmentMessageMatch(customer: Customer): {
    message: string;
    appointmentsData: {
      serviceTime: serviceTime;
      humanizedDate: string;
    }[];
  } {
    // A mensagem que vem abaixo poderia mudar de acordo com o que foi solicitado.
    // No exemplo abaixo, a impressão que dá é já do encerramento da conversa
    // Mas se tiver no começo, pode ser um texto mais convidativo a outras interações

    const message = `Então, ${customer.getName()}.\nJá tem algum horário em mente?`;

    const appointmentsData = this.createAppointmentsToUseOnMessage();

    return { message, appointmentsData };
  }

  handleAppointmentChoice(
    customer: Customer,
    timeChoice: { serviceTime: serviceTime; humanizedDate: string }
  ) {
    const message = `Certo, nessa ${timeChoice.humanizedDate} nos encontraremos.\nJá estou no aguardo, qualquer coisa a mais, só entrar em contato comigo.`;

    this.professional
      .getSchedulingCalendar()
      .scheduleServiceTime(timeChoice.serviceTime, customer);

    customer.setAppointment([timeChoice]);

    return message;
  }

  async getMatchesWithCorpus(message: string) {
    const corpusMethods = [
      { corpusMethod: Corpus.getGreetingCorpus, messageType: "greeting" },
      {
        corpusMethod: Corpus.getAppointmentsCorpus,
        messageType: "appointment/scheduling",
      },
      {
        corpusMethod: Corpus.getHoursAppointment,
        messageType: "hours-appointment/scheduling",
      },
    ];

    const corpusData = await Promise.all(
      corpusMethods.map(async (corpusMethod) => {
        const corpus = await corpusMethod.corpusMethod();

        return {
          corpus,
          messageType: corpusMethod.messageType,
        };
      })
    );

    const messageTypeMatches = corpusData.map((corpus) => {
      return {
        matchesWithMessageType: CosineSimilarity.messageMatchesWithCorpus(
          message,
          corpus.corpus,
          this.cutOff
        ),
        messageType: corpus.messageType as messageType,
      };
    });

    return messageTypeMatches;
  }

  // isso aqui das horas é uma gambiarra so pra funcionar no dia, nem penso que isso dê certo pra mais coisas.
  getAppointmentHoursFromMessage(message: string) {
    const weekDay = this.extractWeekDayFromMessage(message);
    const hour = this.extractHoursFromMessage(message);

    return { hour, day: weekDay, isAvailable: true } as serviceTime;
  }

  private extractWeekDayFromMessage(message: string): number | undefined {
    const days = [
      { text: "domingo", dayNumber: 1 },
      { text: "segunda", dayNumber: 2 },
      { text: "terça", dayNumber: 3 },
      { text: "quarta", dayNumber: 4 },
      { text: "quinta", dayNumber: 5 },
      { text: "sexta", dayNumber: 6 },
      { text: "sabado", dayNumber: 7 },
    ];

    for (const day of days) {
      if (message.includes(day.text)) return day.dayNumber;
    }
  }

  private extractHoursFromMessage(message: string) {
    const regex = /\b(2[0-3]|[01]?\d)h\b/g;
    const possibleHour = message.match(regex);

    return parseInt(possibleHour?.[0].replace("h", "")!);
  }
}
