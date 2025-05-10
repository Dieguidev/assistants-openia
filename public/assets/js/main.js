const sendButton = document.querySelector("#sendButton");
const inputText = document.querySelector("#inputText");
const messagesContainer = document.querySelector(".chat__messages");
const userId = Date.now() + Math.floor(Math.random() * 1000);

const sendMessage = async () => {
  const myMessage = inputText.value.trim();

  if (!myMessage) {
    return false;
  }

  messagesContainer.innerHTML += `<div class="chat__message chat__message--user">Yo: ${myMessage}</div>`;

  inputText.value = "";

  try {
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: myMessage, userId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    messagesContainer.innerHTML += `<div class="chat__message chat__message--bot">Diego: ${data.reply}</div>`;
  } catch (error) {
    console.error("Error:", error);
  }
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

sendButton.addEventListener("click", sendMessage);
inputText.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});
