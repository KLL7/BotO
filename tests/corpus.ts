import ChatBot from "../src/classes/bot/ChatBot";
import Professional from "../src/classes/Professional";
import rl from "readline/promises";
import { stdin as input, stdout as output } from "node:process";

(async () => {
  const readline = rl.createInterface({ input, output });

  const professional = new Professional("João Alberto", "joaoalberto@test.me");

  professional.setGreetings([
    "Olá! Sou da aprimoramento de espelhos quebrados. Estou aqui para te ajudar.",
    "Oi, tudo bem? Estou aqui para poder te atender, como posso te chamar?",
    "Oi, tudo bem? Sou o João Alberto. Estou aqui para te ajudar. Como posso te ajudar?",
    "Essa é mais uma mensagem de teste de saudação.",
    "Manda a braba",
  ]);

  const chatBot = new ChatBot(professional);

  // const messageToAnalyze = await readline.question(">>> ");
  const messageToAnalyze = "Opa cara tudo bem contigo?";

  await chatBot.analyzeMessage(messageToAnalyze);
})();
