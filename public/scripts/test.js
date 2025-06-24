const { logMessage } = require("./logger");

const intents = {
  price: ["price", "cost", "kosten"],
  help: ["help", "support", "hilfe"],
  contact: ["contact", "kontakt", "email"]
};

function detectIntent(input) {
  const lower = input.toLowerCase();

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(word => lower.includes(word))) {
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
  const response = await handleUserInput("user123", "How do i contact you?");
  console.log("🤖 Bot reply:", response);
})();
