import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import Professional from "../../Professional";
import ChatBot from "../ChatBot";
import KeyPhraseLogger from "../../../utils/KeyPhraseLogger";
import { serviceTime } from "../../SchedulingCalendar";
import Customer from "../../Customer";

export default class TelegramChatBot extends ChatBot {
  private telegramBot: TelegramBot;
  private keyPhraseLogger: KeyPhraseLogger;

  constructor(telegramBot: TelegramBot, professional: Professional) {
    super(professional);
    this.telegramBot = telegramBot;
    this.keyPhraseLogger = new KeyPhraseLogger([
      "eu quero",
      "gostaria",
      "eu queria",
    ]);
  }

  inicializeBot(): void {
    this.telegramBot.startPolling({ polling: true });

    console.log("Bot is running...");

    this.telegramBot.on("message", this.handleMessage.bind(this));

  
    // Ainda em construção, tem erro nisso aqui
    this.telegramBot.on("callback_query", this.handleCallbackQuery);
  }

  // Ainda em construção, tem erro nisso aqui
  handleCallbackQuery(callback: CallbackQuery): void {
    const chatId = callback.from.id;

    const data = JSON.parse(callback.data!);
    const customer = new Customer("Nome do cliente", "Numero do clinte");

    this.getProfessional()
      .getSchedulingCalendar()
      .scheduleServiceTime(data as serviceTime, customer);

    this.telegramBot.deleteMessage(chatId, callback.message!.message_id);
  }

  async handleMessage(msg: Message): Promise<void> {
    const messageTypes = await super.analyzeMessage(msg.text!);

    if (messageTypes.includes("greeting")) {
      this.greetingMessages(msg);
      return;
    }

    if (messageTypes.includes("appointment/scheduling")) {
      this.schedulingMessage(msg);
      return;
    }

    if (!messageTypes) {
      const textMessage = "Desculpe, ainda estou treinando para entender isso.";

      this.sendMessage(msg, textMessage);
    }

    this.keyPhraseLogger.detectAndSave(msg.text!, msg.chat.id);
  }

  greetingMessages(msg: Message): void {
    const chatId = msg.chat.id;

    const greeting =
      super.getProfessional().getRandomGreeting() ?? this.getDefaultGreeting();

    this.telegramBot.sendMessage(chatId, greeting);
  }

  createInlineKeyBoardFromAppointments(
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

  schedulingMessage(msg: Message): void {
    const chatId = msg.chat.id;

    const appointments = this.createAppointmentMessage();

    const inline_keyboard =
      this.createInlineKeyBoardFromAppointments(appointments);

    const queryOptions: TelegramBot.SendMessageOptions = {
      reply_markup: {
        inline_keyboard,
      },
    };

    this.telegramBot.sendMessage(
      chatId,
      "Se quiser agendar uma hora comigo é só escolher um dos horários disponíveis",
      queryOptions
    );
  }

  sendMessage(msg: Message, text: string): void {
    const chatId = msg.chat.id;

    if (!text)
      text = "Opa! Ainda estou aprendendo a entender isso, tente outra coisa";

    this.telegramBot.sendMessage(chatId, text);
  }
}
