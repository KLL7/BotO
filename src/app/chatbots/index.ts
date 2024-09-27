import { Application } from "express";
import telBot from "./telegram";

export const useTelegramBot = (app: Application) => {
  const url = app.get("serverUrl")!;
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

  telBot.setWebHook(`${url}/bot${TOKEN}`);

  app.post(`/bot${TOKEN}`, (req, res) => {
    telBot.processUpdate(req.body);
    res.sendStatus(200);
  });
};
