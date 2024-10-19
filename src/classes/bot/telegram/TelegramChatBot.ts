import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import Professional from "../../Professional";
import ChatBot from "../ChatBot";
import KeyPhraseLogger from "../../../utils/KeyPhraseLogger";
import SchedulingCalendar, { serviceTime } from "../../SchedulingCalendar";
import Customer from "../../Customer";
import Corpus from "../../../utils/Corpus";

export default class TelegramChatBot extends ChatBot {
  private telegramBot: TelegramBot;
  private keyPhraseLogger: KeyPhraseLogger;
  private customer: undefined | Customer;

  constructor(telegramBot: TelegramBot, professional: Professional) {
    super(professional);
    this.telegramBot = telegramBot;
    this.keyPhraseLogger = new KeyPhraseLogger([
      "consulta",
      "agendamento",
      "eu queria",
      "fazer um agendamento",
      "queria agendar",
      "agendar consulta",
    ]);
  }

  inicializeBot(): void {
    this.telegramBot.startPolling({ polling: true });

    console.log("Bot is running...");

    this.telegramBot.on("message", this.handleMessage.bind(this));

    this.telegramBot.on("polling_error", (err) => console.log(err));

    this.telegramBot.onText(/cliente/, (msg) => {
      console.log(this.customer);
    });

    this.telegramBot.onText(/relatorio/, (msg) => {
      this.keyPhraseLogger.generateReport(msg.chat.id, this.telegramBot);
    });
  }

  async handleMessage(msg: Message): Promise<void> {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!this.customer) {
      this.registerCustomer(msg);
    }

    this.keyPhraseLogger.detectAndSave(text!, chatId);

    const matchesWithCorpus = await this.getMatchesWithCorpus(msg.text!);

    console.log(`Received message: ${msg.text}`);

    console.log("\n");

    console.log("Matches with this message: ", { matchesWithCorpus });

    console.log("\n");

    for (const match of matchesWithCorpus) {
      if (!match.matchesWithMessageType) continue;

      if (match.messageType === "greeting") {
        this.greetingMessages(msg);
        Corpus.insertGreeting(msg.text!);
      }

      if (match.messageType === "appointment/scheduling") {
        this.schedulingMessage(msg);
        Corpus.insertAppointment(msg.text!);
      }

      if (match.messageType === "hours-appointment/scheduling") {
        this.handleHourChoice(msg);
        Corpus.insertHoursAppointment(msg.text!);
      }
    }
  }

  private greetingMessages(msg: Message): void {
    const chatId = msg.chat.id;

    const greeting =
      super.getProfessional().getRandomGreeting() ?? this.getDefaultGreeting();

    this.telegramBot.sendMessage(chatId, greeting);
  }

  registerCustomer(message: Message): void {
    const chatId = message.chat.id;
    const customerName = message.from?.first_name ?? "Nome não identificado";
    const customerNumber =
      message.contact?.phone_number ?? "Número não identificado";

    this.customer = new Customer(customerName, customerNumber, chatId);
  }

  private schedulingMessage(msg: Message): void {
    const chatId = msg.chat.id;

    const { appointmentsData, message } = this.handleAppointmentMessageMatch(
      this.customer!
    );

    if (!appointmentsData) {
      this.telegramBot.sendMessage(
        chatId,
        "Infelizmente não temos mais horários disponíveis nessa semana."
      );
    }

    this.telegramBot.sendMessage(chatId, message);
  }

  private handleHourChoice(message: Message): void {
    const chatId = message.chat.id;
    const hourChoice = this.getAppointmentHoursFromMessage(message.text!);

    this.getProfessional()
      .getSchedulingCalendar()
      .scheduleServiceTime(hourChoice, this.customer!);

    this.telegramBot.sendMessage(
      chatId,
      `Certo, ${this.customer?.getName()}.\nNossa te espero ${SchedulingCalendar.createHumanizedCalendarFromServiceTime(
        hourChoice
      )}`
    );
  }
}
