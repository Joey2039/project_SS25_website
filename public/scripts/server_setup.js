const express = require("express");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.static("public"));

const accountName = "langreg";
const accountKey = "o/QyUdwG9vppOByFI9vKX6DgJNLSx51Vn6/PmL8GVV88LJCbb5MgQ0/HdoSKWItbuMS+HjKQFy4P+ASthl4Fgw==";
const tableName = "chatlogs";

const credential = new AzureNamedKeyCredential(accountName, accountKey);
const tableClient = new TableClient(
  `https://${accountName}.table.core.windows.net`,
  tableName,
  credential
);

// Endpoint to save user data
app.post("/save_user_data", (req, res) => {
  const userData = req.body;
  const filePath = path.join(path.dirname(__dirname), "/data/user_data.json");

  // Read existing data or initialize an empty array
  fs.readFile(filePath, "utf8", (err, data) => {
    let jsonData = [];
    if (!err && data) {
      jsonData = JSON.parse(data);
    }

    // Append new user data
    jsonData.push(userData);

    // Write updated data back to the file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        res.status(500).send("Failed to save data.");
      } else {
        res.status(200).send("Data saved successfully.");
      }
    });
  });
});
app.post("/logMessage", async (req, res) => {
  const { userId, userMessage, intent } = req.body;
  const timestamp = new Date().toISOString();

  const entity = {
    partitionKey: userId,
    rowKey: `${Date.now()}`, // Use timestamp as unique rowKey
    input: userMessage,
    intent: intent,
    timestamp: timestamp,
  };

  try {
    await tableClient.createEntity(entity);
    console.log("✅ Chat logged:", entity);
    res.status(200).send("Message logged successfully.");
  } catch (error) {
    console.error("❌ Failed to log message:", error);
    res.status(500).send("Failed to log message.");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
