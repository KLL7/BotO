import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import Professional from "../../Professional";
import ChatBot from "../ChatBot";
import KeyPhraseLogger from "../../../utils/KeyPhraseLogger";
import { serviceTime } from "../../SchedulingCalendar";
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
    this.handleCallbackQuery = this.handleCallbackQuery.bind(this);
  }

  inicializeBot(): void {
    this.telegramBot.startPolling({ polling: true });

    console.log("Bot is running...");

    this.telegramBot.on("message", this.handleMessage.bind(this));

    // Ainda em construção, tem erro nisso aqui
    this.telegramBot.on("callback_query", this.handleCallbackQuery);

    this.telegramBot.on("polling_error", (err) => console.log(err));

    this.telegramBot.onText(/cliente/, (msg) => {
      console.log(this.customer);
    });
  }

  // Ainda em construção, tem erro nisso aqui
  // Mudanças feitas aqui, não sei se o comentário de cima ainda é válido
  private handleCallbackQuery(callback: CallbackQuery): void {
    const appointmentData = JSON.parse(callback.data!);
    const response = this.handleAppointmentChoice(this.customer!, {
      serviceTime: appointmentData,
      humanizedDate: this.getProfessional()
        .getSchedulingCalendar()
        .createHumanizedCalendarFromServiceTime(appointmentData),
    } as { serviceTime: serviceTime; humanizedDate: string });

    const chatId = callback.from.id;
    const appointmentTime = this.getProfessional()
      .getSchedulingCalendar()
      .createHumanizedCalendarFromServiceTime(appointmentData);

    if (this.customer) {
      this.keyPhraseLogger.logAppointment(
        this.customer.getName(),
        chatId,
        appointmentTime
      );
    }

    this.telegramBot.deleteMessage(chatId, callback.message!.message_id!);

    this.telegramBot.sendMessage(chatId, response);
  }

  async handleMessage(msg: Message): Promise<void> {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/relatorio") {
      this.keyPhraseLogger.generateReport(chatId, this.telegramBot);
      return;
    }

    if (!this.customer) {
      this.registerCustomer(msg);
    }

    //Deixando marcado
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
    }
  }

  private greetingMessages(msg: Message): void {
    const chatId = msg.chat.id;

    const greeting =
      super.getProfessional().getRandomGreeting() ?? this.getDefaultGreeting();

    this.telegramBot.sendMessage(chatId, greeting);
  }

  private createInlineKeyBoardFromAppointments(
    appointments: {
      serviceTime: serviceTime;
      humanizedDate: string;
    }[]
  ): TelegramBot.InlineKeyboardButton[][] {
    const inlineKeyBoard: TelegramBot.InlineKeyboardButton[][] = [];

    for (let day = 1; day <= 7; day++) {
      const week = [];
      for (const appointment of appointments) {
        if (appointment.serviceTime.day == day) {
          week.push({
            text: appointment.humanizedDate,
            callback_data: JSON.stringify(appointment.serviceTime),
          });
        }
      }
      inlineKeyBoard.push(week);
    }

    return inlineKeyBoard;
  }

  private createQueryOptions(
    appointments: {
      serviceTime: serviceTime;
      humanizedDate: string;
    }[]
  ) {
    const inline_keyboard =
      this.createInlineKeyBoardFromAppointments(appointments);

    const queryOptions: TelegramBot.SendMessageOptions = {
      reply_markup: {
        inline_keyboard,
      },
    };

    return queryOptions;
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

    this.telegramBot.sendMessage(
      chatId,
      message,
      this.createQueryOptions(appointmentsData)
    );
  }
}
