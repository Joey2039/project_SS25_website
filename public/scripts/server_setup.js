const express = require("express");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { emit } = require("process");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const accountName = "langreg";
const accountName2 = "lngeg";
const accountKey =
  "o/QyUdwG9vppOByFI9vKX6DgJNLSx51Vn6/PmL8GVV88LJCbb5MgQ0/HdoSKWItbuMS+HjKQFy4P+ASthl4Fgw==";
const accountKey2 =
  "57+y4p00mcCBp/UlGxRNfbCSbeFdnZoSy6w6VFI8At3xSej7QXieq2Og60HQsncrWXphl6irhXZH+AStI2sKtQ==";
const tableName = "chatlogs";
const tabelUserdata = "userdata";

const credential = new AzureNamedKeyCredential(accountName, accountKey);
const credential2 = new AzureNamedKeyCredential(accountName2, accountKey2);
const tableClient = new TableClient(
  `https://${accountName}.table.core.windows.net`,
  tableName,
  credential
);
const tableClient2 = new TableClient(
  `https://${accountName2}.table.core.windows.net`,
  tabelUserdata,
  credential2
);

// Endpoint to save user data
app.post("/save_user_data", async (req, res) => {
  const { email, agb, newsletter } = req.body;
  const timestamp = new Date().toISOString();

  const entity = {
    partitionKey: email,
    rowKey: `${Date.now()}`,
    agb: agb,
    newsletter: newsletter,
    timestamp: timestamp,
  };
  console.log("Entity object:", entity);
  try {
    await tableClient2.createEntity(entity);
    console.log("✅ Chat logged:", entity);
    res.status(200).send("Message logged successfully.");
  } catch (error) {
    console.error("❌ Failed to log message:", error);
    res.status(500).send("Failed to log message.");
  }
});
app.post("/logMessage", async (req, res) => {
  const { userId, userMessage, intent } = req.body;
  const timestamp = new Date().toISOString();

  const entity = {
    partitionKey: userId,
    rowKey: `${Date.now()}`,
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
