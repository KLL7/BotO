import cors from "cors";
import express from "express";

// TODO: Add options to cors

// Call this function in config/app
// This function receives an express app and adds all middlewares configurations to it
export const useMiddlewares = (app: any) => {
  app.use(cors());

  app.use(express.json());
}