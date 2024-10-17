import Corpus from "../../utils/Corpus";
import CosineSimilarity from "../../utils/CosineSimilarity";
import File from "../../utils/File";
import Customer from "../Customer";
import Professional from "../Professional";
import { serviceTime } from "../SchedulingCalendar";

type messageType = "greeting" | "appointment/scheduling";

interface matchWithType {
  message: string;
  corpusMethod: () => Promise<string[]>;
  messageType: messageType;
  insertMethod: (message: string) => void;
}

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
          schedulingCalendar.createHumanizedCalendarFromServiceTime(
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

    const message = `Então, ${customer.getName()}.\nEm qual horário fica melhor para nos encontrarmos?`;

    const appointmentsData = this.createAppointmentsToUseOnMessage();

    return { message, appointmentsData };
  }

  handleAppointmentChoice(
    customer: Customer,
    timeChoice: { serviceTime: serviceTime; humanizedDate: string }
  ) {
    const message = `Certo, nessa ${timeChoice.humanizedDate} nos encontraremos.\nJá estou no aguardo, qualquer coisa a mais, só entrar em contato comigo.`;
    console.log(timeChoice);

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
}
