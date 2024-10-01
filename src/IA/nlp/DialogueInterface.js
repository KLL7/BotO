const { NlpManager } = require("node-nlp");

const manager = new NlpManager({language: ['pt'], forceNER: true})

const processInputs = async (manager, context, input = {}) => {
  const result = await manager.process('pt', input, context)
}

(async () => {
  await manager.train();
  manager.save();

  console.log('Chatbot está pronto! (Digite "sair" para encerrar)');

  let context = {};

  process.stdin.on('data', async (input) => {
    const message = input.toString().trim();
    if (message === 'sair') {
      process.exit();
    }
  });
});
