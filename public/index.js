const addNewMessage = document.getElementById("addMessageField");
const submitButton = document.getElementById("submitButton");

const newMessageField = (idNumber = 1) => `
    <div class="mb-3">
      <label class="form-label">
        <span>Mensagem de saudação ${idNumber}</span>
        <textarea
          class="messageContent form-control my-3"
          id="messageContent${idNumber}"
          rows="3"
          placeholder="Digite o conteúdo da mensagem aqui..."
        ></textarea>
      </label>
    </div>
`;

addNewMessage.addEventListener("click", (event) => {
  event.preventDefault();

  const messagesField = document.getElementById("messageFields");

  const messageFields = document.getElementsByClassName("messageContent");

  const newField = newMessageField(messageFields.length + 2);

  messagesField.insertAdjacentHTML("beforeend", newField);
});
