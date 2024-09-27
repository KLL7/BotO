import express from "express";
// Import all routes
import telegramBotRouter from "./chatbot.telegram.route";

const router = express.Router();

export const useRoutes = (app: express.Application) => {
  // Use all routes here
  app.use("/bot", telegramBotRouter);

  app.use("/api", router);
};
