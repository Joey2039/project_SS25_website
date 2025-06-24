import { logMessage } from "./logger.js"; // Import logMessage from logger.js

class Bot {
  constructor() {
    this.dict = {};
    this.keywords_combi_2 = {};
    this.keywords_combi_3 = {};
    this.keywords_combi_4 = {};
    // Load dictionary data from a JSON file
    fetch("/data/dictionary_data.json")
      .then((response) => response.json())
      .then((data) => {
        this.dict = data;
      })
      .catch((error) => {
        console.error("Failed to load dictionary data:", error);
      });
    fetch("/data/keyword_data_2.json")
      .then((response) => response.json())
      .then((data) => {
        this.keywords_combi_2 = data;
      })
      .catch((error) => {
        console.error("Failed to load keywords_combi_2 data:", error);
      });
    fetch("/data/keyword_data_3.json")
      .then((response) => response.json())
      .then((data) => {
        this.keywords_combi_3 = data;
      })
      .catch((error) => {
        console.error("Failed to load keywords_combi_3 data:", error);
      });
    fetch("/data/keyword_data_4.json")
      .then((response) => response.json())
      .then((data) => {
        this.keywords_combi_4 = data;
      })
      .catch((error) => {
        console.error("Failed to load keywords_combi_4 data:", error);
      });
  }

  detectIntent(input) {
    const lower = input.toLowerCase();

    for (const [intent, keywords] of Object.entries(this.dict)) {
      if (keywords.some((word) => lower.includes(word))) {
        return intent;
      }
    }

    return "unknown";
  }

  async reaction_to_Message(message) {
    const intent = this.detectIntent(message); // Correctly call detectIntent

    await logMessage("userId", message, intent); // Replace 'userId' with the actual user ID if available

    let inhalt = "Sorry, I didn’t understand.";
    return inhalt; // Return the constructed inhalt string
  }
}

const bot = new Bot();

export function sendMessage() {
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

  const botResponse = bot.reaction_to_Message(message);

  // Add the bot's response to the chat
  const botMessageElement = document.createElement("div");
  botMessageElement.classList.add("message", "incoming");
  botMessageElement.innerHTML = `<p>${botResponse}</p>`;
  chatbody.appendChild(botMessageElement);

  chatbot__input.value = ""; // Clear the input field
  chatbody.scrollTop = chatbody.scrollHeight; // Scroll to the bottom of the chat
}
