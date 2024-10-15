import Corpus from "../../utils/Corpus";
import CosineSimilarity from "../../utils/CosineSimilarity";
import File from "../../utils/File";
import Professional from "../Professional";

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

  createAppointmentMessage() {
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

  async analyzeMessage(
    message: string
  ): Promise<Array<messageType | undefined>> {
    const messagesTypesToAnalyze: matchWithType[] = [
      {
        message,
        corpusMethod: Corpus.getGreetingCorpus,
        messageType: "greeting",
        insertMethod: Corpus.insertGreeting,
      },
      {
        message,
        corpusMethod: Corpus.getAppointmentsCorpus,
        messageType: "appointment/scheduling",
        insertMethod: Corpus.insertAppointment,
      },
    ];

    const promisesToAnalyze = messagesTypesToAnalyze.map((type) =>
      this.matchWithCorpusMessageType(type)
    );

    return await Promise.all(promisesToAnalyze);
  }

  async matchWithCorpusMessageType({
    corpusMethod,
    insertMethod,
    message,
    messageType,
  }: matchWithType): Promise<messageType | undefined> {
    const corpus = await corpusMethod();

    let dontMatchSimilarities = "";

    for (let i = 0; i < corpus.length; i++) {
      const phrase = corpus[i];

      const similarity = CosineSimilarity.compareTwoPhrases(message, phrase, 3);

      if (similarity >= this.cutOff) {
        File.saveChatMessageCSV(message, messageType);
        insertMethod(message);

        console.log(`${phrase} (similarity: ${similarity})`);

        return messageType;
      }

      dontMatchSimilarities += `${phrase}: ${similarity}\n`;

      if (i == corpus.length - 1) {
        console.log("No match found");
        console.log(`Similarities: ${dontMatchSimilarities}`);
      }
    }
  }
}
