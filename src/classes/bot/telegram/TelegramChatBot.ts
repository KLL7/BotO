import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import Professional from "../../Professional";
import ChatBot from "../ChatBot";

export default class TelegramChatBot extends ChatBot {
  private telegramBot: TelegramBot;
  private reservedMessages: string[] = [];

  constructor(telegramBot: TelegramBot, professional: Professional) {
    super(professional);
    this.telegramBot = telegramBot;
  }

  inicializeBot(): void {
    this.telegramBot.startPolling({ polling: true });
    console.log("Bot is running...");
    this.reservedMessages.push("//time/");

    this.telegramBot.on("message", async (msg) => {
      const response = await super.analyzeMessage(msg.text!);
      this.sendMessage(msg, response!);
    });

    // this.telegramBot.on("callback_query", (callback) =>
    //   this.handleTimeChoice(callback)
    // );
    // this.telegramBot.on("polling_error", (msg) => console.log(msg));
    // this.telegramBot.onText(/\/time/, (msg) => this.showFreeTime(msg));
  }

  greetingMessages(msg: Message): void {
    const chatId = msg.chat.id;

    const greeting =
      super.getProfessional().getRandomGreeting() ?? this.getDefaultGreeting();

    this.telegramBot.sendMessage(chatId, greeting);
  }

  sendMessage(msg: Message, text: string): void {
    const chatId = msg.chat.id;

    if (!text)
      text = "Opa! Ainda estou aprendendo a entender isso, tente outra coisa";

    this.telegramBot.sendMessage(chatId, text);
  }

  showFreeTime(msg: Message): void {
    const chatId = msg.chat.id;
    const inline_keyboard = super.getProfessional().getFreeTime();
    /**
     * TODO: Implementar uma lógica de resposta
     */
    const opt: TelegramBot.SendMessageOptions = {
      reply_to_message_id: msg.message_id,
      reply_markup: { inline_keyboard },
    };

    this.telegramBot.sendMessage(chatId, "Estes sãos os coisos", opt);
  }

  handleTimeChoice(callback: CallbackQuery): void {
    const chatId = callback.from.id;
    const timeChoice = callback.data;
    const response = `Seu atendimento foi marcado para ${timeChoice}`;
    // TODO: Implementar lógica de agendamento, onde o horário some da lista ao ser escolhido

    this.telegramBot.sendMessage(chatId, response);
  }

  getDefaultGreeting(): string {
    return `
      Olá! Me chamo ${super.getProfessional().getName()}.
      Como posso te ajudar?
    `;
  }
}
