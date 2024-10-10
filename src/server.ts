import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import Professional from "../src/classes/Professional";
import TelegramChatBot from "../src/classes/bot/telegram/TelegramChatBot";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {});
const professional = new Professional('João Alberto', 'joãoalberto@test.me');

const chatBot = new TelegramChatBot(bot, professional);

chatBot.inicializeBot();
