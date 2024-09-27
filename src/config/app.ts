// This file is used to configure all routes and middlewares used in the app

import express from "express";
import { useMiddlewares } from "../middlewares";
import { useRoutes } from "../app/routes/";
import { useTelegramBot } from "../app/chatbots";

const app = express();
app.set("serveUrl", process.env.SERVER_URL || "http://localhost:3000");

useRoutes(app);
useMiddlewares(app);
useTelegramBot(app);

export default app;
