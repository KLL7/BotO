const { NlpManager } = require("node-nlp");
const fs = require("fs");
const path = require("path");

const manager = new NlpManager({ languages: ["pt"], forceNER: true });

const loadCorpus = () => {
  const filePath = path.join(__dirname, "conversations", "conversations.json");
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

const processInputs = async (manager, context, input = {}) => {
  const result = await manager.process("pt", input, context);
  console.log(result.answer || "Desculpe, não entendi sua pergunta.");
};

(async () => {
  const corpus = loadCorpus();

  corpus.conversations.forEach((conversation) => {
    conversation.variações.forEach((example) => {
      manager.addDocument("pt", example, conversation.pergunta);
    });

    conversation.resposta.forEach((response) => {
      manager.addAnswer("pt", conversation.pergunta, response);
    });
  });

  await manager.train();
  manager.save();

  console.log('Chatbot está pronto! (Digite "sair" para encerrar)');

  let context = {};

  process.stdin.on("data", async (input) => {
    const message = input.toString().trim();
    if (message === "sair") {
      process.exit();
    }

    await processInputs(manager, context, message);
  });
})();
