import express from "express";
// Import all routes
import professionalRouter from "./professional.routes";

const router = express.Router();

export const useRoutes = (app: express.Application) => {
  // Use all routes here
  router.use("/professional", professionalRouter);

  app.use("/api", router);
};
