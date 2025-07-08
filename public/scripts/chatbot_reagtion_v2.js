import { logMessage } from "./logger.js"; // Import logMessage from logger.js

class Bot {
  constructor() {
    this.dict = {};
    this.responses = {};
    this.responses_1 = {};
    this.fallback = {};
    this.rndUserID = "User_ID_" + Math.floor(Math.random() * 1000);
    this.sessionContext = new Map();
    this.questions = {};
    this.notagain = [];
    // Load dictionary data from a JSON file
    fetch("/data/dictionary_data.json")
      .then((response) => response.json())
      .then((data) => {
        this.dict = data;
      })
      .catch((error) => {
        console.error("Failed to load dictionary data:", error);
      });
    fetch("/data/responses.json")
      .then((response) => response.json())
      .then((data) => {
        this.responses = data;
      })
      .catch((error) => {
        console.error("Failed to load responses data:", error);
      });
    fetch("/data/responses_1.json")
      .then((response) => response.json())
      .then((data) => {
        this.responses_1 = data;
      })
      .catch((error) => {
        console.error("Failed to load responses_1 data:", error);
      });
    fetch("/data/fallback_questions.json")
      .then((response) => response.json())
      .then((data) => {
        this.fallback = data;
      })
      .catch((error) => {
        console.error("Failed to load fallback questions data:", error);
      });
  }
  filter(nachricht) {
    return nachricht
      .replace(/[^\w\s-]/g, " ")
      .toLowerCase()
      .trim();
  }
  getSession(userId) {
    if (!this.sessionContext.has(userId)) {
      this.sessionContext.set(userId, {
        lastObject: null,
        lastIntent: null,
        lastMessage: null,
        lastTimestamp: null,
        messageHistory: [], // Add message history
      });
    }

    return this.sessionContext.get(userId);
  }
  findCategoryForWord(word) {
    for (const [category, data] of Object.entries(this.dict)) {
      const allWords = [...(data.keywords || []), ...(data.objects || [])];
      if (allWords.includes(word)) return category;
    }
    return null;
  }
  updateSession(userId, { object, intent, message }) {
    const sessmap = this.getSession(userId);
    if (object) sessmap.lastObject = object;
    if (intent) sessmap.lastIntent = intent;
    sessmap.lastMessage = message;
    sessmap.lastCategory = this.findCategoryForWord(object || intent);
    sessmap.lastTimestamp = new Date().toISOString();

    // Append the message and intent to the message history
    sessmap.messageHistory.push({
      timestamp: new Date().toISOString(),
      message,
      intent,
      object,
    });
  }
  areLastMessagesSameCategory(userId) {
    const sessmap = this.getSession(userId);
    if (!sessmap.lastMessage || !sessmap.secondLastMessage) return false;

    const lastCategory = sessmap.lastCategory;
    const previousObject = sessmap.lastObject;
    const previousCategory = this.findCategoryForWord(
      previousObject,
      this.dict
    );

    return (
      lastCategory && previousCategory && lastCategory === previousCategory
    );
  }
  detectIntent(input) {
    const text = this.filter(input);
    const userId = this.rndUserID;
    const sessmap = this.getSession(userId);

    let intent = null;
    let object = null;
    let objects = [];
    // Detect intent and object from the current message
    for (const [intentName, data] of Object.entries(this.dict)) {
      if (data.keywords.some((k) => text.includes(k))) {
        intent = intentName;
        for (const obj of data.objects) {
          if (text.includes(obj)) {
            object = obj;
            break;
          }
        }
        objects = data.objects;
        break;
      }
    }

    if (!object && sessmap.lastObject && intent) {
      if (text.includes(sessmap.lastObject)) {
        object = sessmap.lastObject;
      }
    }

    // If no intent was found, check for objects
    if (!intent) {
      if (sessmap.lastIntent) {
        for (const [category, data] of Object.entries(this.dict)) {
          if (data.objects.some((obj) => text.includes(obj))) {
            if (sessmap.lastCategory === category) {
              intent = sessmap.lastIntent;
              object = data.objects.find((obj) => text.includes(obj));
              break;
            }
          }
        }
      } else {
        intent = "unknown";
        for (const [category, data] of Object.entries(this.dict)) {
          if (data.objects.some((obj) => text.includes(obj))) {
            object = data.objects.find((obj) => text.includes(obj));
            break;
          }
        }
      }
    }

    // Update session
    console.log("Detected intent:", intent, "Object:", object);
    this.updateSession(userId, { object, intent, message: input });

    if (intent && object && intent !== "unknown") return `${object}_${intent}`;
    if (intent) return intent;
    return "unknown";
  }
  response_to_Message() {
    const userId = this.rndUserID;
    const sessmap = this.getSession(userId);

    // Get a random template
    let template = this.templates[randomInt(0, this.templates.length - 1)];

    // Replace {item} with a random object or intent from the dictionary
    if (template.includes("{item}")) {
      let replacement = "something"; // Default fallback value

      // Collect all objects and intents from the dictionary
      const allObjects = [];
      const allIntents = Object.keys(this.dict);

      for (const data of Object.values(this.dict)) {
        if (data.objects) {
          allObjects.push(...data.objects);
        }
      }

      // Randomly select an object or intent if available
      if (allObjects.length > 0 || allIntents.length > 0) {
        const randomChoice = randomInt(
          0,
          allObjects.length + allIntents.length - 1
        );
        if (randomChoice < allObjects.length) {
          replacement = allObjects[randomChoice]; // Random object
        } else {
          replacement = allIntents[randomChoice - allObjects.length]; // Random intent
        }
      }

      template = template.replace("{item}", replacement);
    }

    return template;
  }
  async reaction_to_Message(message) {
    const intent = this.detectIntent(message);

    await logMessage(this.rndUserID, message, intent); // Log the message and intent
    // Check if the intent exists in the responses_1
    if (this.responses_1[intent]) {
      const responseVariants = this.responses_1[intent];

      // Ensure responseVariants is defined
      if (!responseVariants || responseVariants.length === 0) {
        return "Sorry, I don’t have a response for that.";
      }

      // Check if the intent has already been handled
      const previousResponses = this.notagain.filter((entry) =>
        entry.startsWith(intent)
      );
      if (previousResponses.length >= responseVariants.length) {
        return "Sorry, I already answered that question.";
      }

      // Determine the next response variant
      const nextVariantIndex =
        previousResponses.length % responseVariants.length;
      const nextResponse = responseVariants[nextVariantIndex];

      // Track the response to avoid repetition
      this.notagain.push(`${intent}_${nextVariantIndex + 1}`);

      return nextResponse;
    }

    // Check if the intent exists in the responses
    if (this.responses[intent]) {
      const responseVariants = this.responses[intent];

      // Ensure responseVariants is defined
      if (!responseVariants || responseVariants.length === 0) {
        return "Sorry, I don’t have a response for that.";
      }

      // Check if the intent has already been handled
      const previousResponses = this.notagain.filter((entry) =>
        entry.startsWith(intent)
      );
      if (previousResponses.length >= responseVariants.length) {
        return "Sorry, I already answered that question.";
      }

      // Determine the next response variant
      const nextVariantIndex =
        previousResponses.length % responseVariants.length;
      const nextResponse = responseVariants[nextVariantIndex];

      // Track the response to avoid repetition
      this.notagain.push(`${intent}_${nextVariantIndex + 1}`);

      return nextResponse;
    }

    // Try fallback responses if no valid intent or response is found
    if (this.fallback && this.fallback.length > 0) {
      // Check if all fallback responses have been used
      const previousFallbacks = this.notagain.filter((entry) =>
        entry.startsWith("fallback")
      );
      if (previousFallbacks.length >= this.fallback.length) {
        return "Sorry, I didn’t understand.";
      }

      // Determine the next fallback response
      const nextFallbackIndex = previousFallbacks.length % this.fallback.length;
      const nextFallbackResponse = this.fallback[nextFallbackIndex];

      // Track the fallback response to avoid repetition
      this.notagain.push(`fallback_${nextFallbackIndex + 1}`);

      return nextFallbackResponse;
    }

    // Default response if no fallback is available
    return "Sorry, I didn’t understand.";
  }
}

// Helper function to generate a random integer between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const bot = new Bot();

export async function sendMessage() {
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

  // Await the bot's response
  const botResponse = await bot.reaction_to_Message(message);
  console.log("Bot response:", botResponse);

  // Add the bot's response to the chat
  const botMessageElement = document.createElement("div");
  botMessageElement.classList.add("message", "incoming");
  botMessageElement.innerHTML = `<p>${botResponse}</p>`;
  chatbody.appendChild(botMessageElement);

  chatbot__input.value = ""; // Clear the input field
  chatbody.scrollTop = chatbody.scrollHeight; // Scroll to the bottom of the chat
}
