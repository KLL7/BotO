import ChatBot from "../src/classes/bot/ChatBot";
import Professional from "../src/classes/Professional";

const professional = new Professional("nome", "nome");
const bot = new ChatBot(professional);

const result = bot.getAppointmentHoursFromMessage("Pode agendar para terça às 15h");

console.log(result);
