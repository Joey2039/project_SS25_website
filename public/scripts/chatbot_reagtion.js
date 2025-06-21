class Bot {
  constructor() {
    this.dict = {
      hallo: "Hallo",
      hi: "Hi",
      "guten morgen": "Guten Morgen",
      "guten abend": "Guten Abend",
      "guten nacht": "Guten Nacht",
      "guten tag": "Guten Tag",
      "wie gehts": "Mir geht es gut, danke der Nachfrage!",
    };
  }

  reaction_to_Message(message) {
    const nachricht = message.toLowerCase();
    let inhalt = "Ich versteh gar nichts";

    // Iterate through the dictionary to find a matching response
    for (const key in this.dict) {
      if (nachricht.includes(key)) {
        inhalt = this.dict[key];
        break; // Stop searching once a match is found
      }
    }

    return inhalt; // Return the response
  }
}

const bot = new Bot();
function sendMessage() {
  const chatbot__input = document.getElementById("chatbot-input");
  const message = chatbot__input.value;

  if (message === "") {
    alert("Please enter a message.");
    return;
  }

  const chatbody = document
    .getElementById("chat-card")
    .querySelector(".chat-body");
  if (!chatbody) {
    console.error("Chat body element not found.");
    return;
  }

  // Add the user's message to the chat
  const userMessageElement = document.createElement("div");
  userMessageElement.classList.add("message", "outgoing");
  userMessageElement.innerHTML = `<p>${message}</p>`;
  chatbody.appendChild(userMessageElement);

  // Get the bot's response
  const botResponse = bot.reaction_to_Message(message);

  // Add the bot's response to the chat
  const botMessageElement = document.createElement("div");
  botMessageElement.classList.add("message", "incoming");
  botMessageElement.innerHTML = `<p>${botResponse}</p>`;
  chatbody.appendChild(botMessageElement);

  chatbot__input.value = ""; // Clear the input field
  chatbody.scrollTop = chatbody.scrollHeight; // Scroll to the bottom of the chat
}
