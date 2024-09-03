import { Request, Response } from "express";

export default class ProfessionalController {
  static async getAll(req: Request, res: Response) {
    res.send("TEST TO GET ALL PROFESIONALS");
  }
  static async getOne(req: Request, res: Response) {}
  static async update(req: Request, res: Response) {}
  static async delete(req: Request, res: Response) {}
  static async signIn(req: Request, res: Response) {}
  static async signUp(req: Request, res: Response) {}
  static async fillBotModel(req: Request, res: Response) {}
}
