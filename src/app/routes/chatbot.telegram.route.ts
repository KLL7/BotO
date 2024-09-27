import { Router } from "express";

const router = Router();

router.get("/telegram", (req, res) => {
  res.send("Telegram Chatbot is working!");
})

router.post("/telegram", (req, res) => {
  res.send("Telegram Chatbot is working!");
})

export default router;