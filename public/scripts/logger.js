export async function logMessage(userId, userMessage, intent) {
  const response = await fetch("http://localhost:3000/logMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      userMessage,
      intent,
    }),
  });

  if (response.ok) {
    console.log("✅ Chat logged successfully.");
  } else {
    console.error("❌ Failed to log chat:", await response.text());
  }
}
