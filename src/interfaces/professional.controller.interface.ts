import { Request, Response } from "express";

export interface IProfessionalController {
  //TODO: Add a type to all methods
  getAll(req: Request, res: Response): Promise<any>;
  getOne(req: Request, res: Response): Promise<any>;
  update(req: Request, res: Response): Promise<any>;
  delete(req: Request, res: Response): Promise<any>;
  signIn(req: Request, res: Response): Promise<any>;
  signUp(req: Request, res: Response): Promise<any>;
  fillBotModel(req: Request, res: Response): Promise<any>;
}
