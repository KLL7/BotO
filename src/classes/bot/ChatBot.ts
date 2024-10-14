import Corpus from "../../utils/Corpus";
import CosineSimilarity from "../../utils/CosineSimilarity";
import File from "../../utils/File";
import Professional from "../Professional";

interface matchWithType {
  message: string;
  corpusMethod: () => Promise<string[]>;
  messageType: string;
  insertMethod: (message: string) => void;
}

export default class ChatBot {
  private professional;
  private cutOff = 0.4;

  constructor(professional: Professional) {
    this.professional = professional;
  }

  getProfessional() {
    return this.professional;
  }

  async analyzeMessage(message: string) {
    const messagesTypesToAnalyze: matchWithType[] = [
      {
        message,
        corpusMethod: Corpus.getGreetingCorpus,
        messageType: "greeting",
        insertMethod: Corpus.insertGreeting,
      },
    ];

    const promisesToAnalyze = messagesTypesToAnalyze.map((type) =>
    this.matchWithCorpusMessageType(type) 
  );

    return (await Promise.all(promisesToAnalyze))[0];
  }

  async matchWithCorpusMessageType({
    corpusMethod,
    insertMethod,
    message,
    messageType,
  }: matchWithType) {
    const corpus = await corpusMethod();

    let dontMatchSimilarities = "";

    for (let i = 0; i < corpus.length; i++) {
      const phrase = corpus[i];

      const similarity = CosineSimilarity.compareTwoPhrases(message, phrase, 3);

      if (similarity >= this.cutOff) {
        File.saveChatMessageCSV(message, messageType);
        insertMethod(message);

        console.log(`${phrase} (similarity: ${similarity})`);

        return this.getProfessional().getRandomGreeting();
      }

      dontMatchSimilarities += `${phrase}: ${similarity}\n`;

      if (i == corpus.length - 1) {
        console.log("No match found");
        console.log(`Similarities: ${dontMatchSimilarities}`);
      }
    }
  }
}
