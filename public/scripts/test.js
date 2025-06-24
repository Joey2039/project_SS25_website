const { logMessage } = require("./logger");
const fs = require("fs");
const path = require("path");

// Load intents from dictionary_data.json
let intents = {
  price: ["price", "cost", "kosten"],
  help: ["help", "support", "hilfe"],
  contact: ["contact", "kontakt", "email"],
};

const dictionaryPath = path.join(__dirname, "dictionary_data.json");

try {
  const data = fs.readFileSync(dictionaryPath, "utf8");
  intents = JSON.parse(data);
} catch (error) {
  console.error("Failed to load dictionary data:", error);
}

function detectIntent(input) {
  const lower = input.toLowerCase();

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some((word) => lower.includes(word))) {
      return intent;
    }
  }

  return "unknown";
}

// Simulated chatbot interaction
async function handleUserInput(userId, message) {
  const intent = detectIntent(message);

  // Store the message in Azure Table Storage
  await logMessage(userId, message, intent);

  // Respond to user
  switch (intent) {
    case "price":
      return "Our service costs between 10€ and 50€.";
    case "help":
      return "Sure! What do you need help with?";
    case "contact":
      return "You can email us at contact@example.com";
    default:
      return "Sorry, I didn’t understand.";
  }
}

// 🔁 Simulate a user message
(async () => {
  const response = await handleUserInput(
    "user123",
    "what is the price of your cost?"
  );
  console.log("🤖 Bot reply:", response);
})();
