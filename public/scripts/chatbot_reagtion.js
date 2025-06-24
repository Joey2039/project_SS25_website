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
  syn(nachricht, dictionary) {
    if (typeof dictionary === "string") {
      console.log("Dictionary is a string, splitting it into an array.");
      dictionary = dictionary.split(",").map((word) => word.trim());
    }
    for (const word of dictionary) {
      if (nachricht.includes(word)) {
        return true;
      }
    }
    return false; // Return false if no match is found
  }
  filter(nachricht) {
    return nachricht.replace(/[^\w\s-]/g, " ");
  }

  reaction_to_Message(message) {
    const nachricht = message.toLowerCase();
    nachricht = this.filter(nachricht); // Filter the message to remove unwanted characters
    let inhalt = "Ich versteh gar nichts";
    let content_key = "";
    for (const key in this.dict) {
      if (nachricht.includes(key) || this.syn(nachricht, this.dict[key])) {
        content_key += key + ";"; // Store the key that matched
        /*if (inhalt === "Ich versteh gar nichts") {
          inhalt = "Special 1" + `; ${key}`;
        } else {
          inhalt += `; ${key}`;
        }*/
      }
    }
    let content_arr = content_key.split(";").map((word) => word.trim());
    content_arr = content_arr.filter((word) => word !== ""); // Remove empty strings
    console.log("Content Array:", content_arr);
    console.log("Content Key:", this.keywords_combi_2["explain_price"]);
    for (const key in this.keywords_combi_2) {
      if (
        JSON.stringify(content_arr.sort()) ===
          JSON.stringify(this.keywords_combi_2[key].sort()) ||
        JSON.stringify(content_arr.sort()) ===
          JSON.stringify(this.keywords_combi_2[key].reverse())
      ) {
        inhalt = "haha";
        console.log("Match found:", key);
        break; // Stop searching once a match is found
      }
    }
    for (const key in this.keywords_combi_3) {
      if (
        JSON.stringify(content_arr.sort()) ===
          JSON.stringify(this.keywords_combi_3[key].sort()) ||
        JSON.stringify(content_arr.sort()) ===
          JSON.stringify(this.keywords_combi_3[key].reverse())
      ) {
        inhalt = "hahahaha";
        console.log("Match found:", key);
        break; // Stop searching once a match is found
      }
    }
    for (const key in this.keywords_combi_4) {
      if (
        JSON.stringify(content_arr.sort()) ===
          JSON.stringify(this.keywords_combi_4[key].sort()) ||
        JSON.stringify(content_arr.sort()) ===
          JSON.stringify(this.keywords_combi_4[key].reverse())
      ) {
        inhalt = "hahahaha";
        console.log("Match found:", key);
        break; // Stop searching once a match is found
      }
    }
    return inhalt; // Return the constructed inhalt string
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
