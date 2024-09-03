import cors from "cors"; // Maybe add a file exporting cors with all options
import express from "express";

// TODO: Add options to cors

// Call this function in config/app
// This function receives an express app and adds all middlewares configurations to it
export const useMiddlewares = (app: express.Application) => {
  app.set("port", process.env.PORT || 3000);
  
  app.use(cors());

  app.use(express.json());
}