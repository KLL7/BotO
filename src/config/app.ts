// This file is used to configure all routes and middlewares used in the app

import express from "express";
import { useMiddlewares } from "../middlewares";
import { useRoutes } from "../app/routes/";

const app = express();

useRoutes(app);
useMiddlewares(app);

export default app;
