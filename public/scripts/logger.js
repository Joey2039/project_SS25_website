const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

// Replace with your values
const accountName = "langreg";
const accountKey = "o/QyUdwG9vppOByFI9vKX6DgJNLSx51Vn6/PmL8GVV88LJCbb5MgQ0/HdoSKWItbuMS+HjKQFy4P+ASthl4Fgw==";
const tableName = "chatlogs";

const credential = new AzureNamedKeyCredential(accountName, accountKey);
const tableClient = new TableClient(
  `https://${accountName}.table.core.windows.net`,
  tableName,
  credential
);

async function logMessage(userId, userMessage, intent) {
  const timestamp = new Date().toISOString();

  const entity = {
    partitionKey: userId,
    rowKey: `${Date.now()}`, // Use timestamp as unique rowKey
    input: userMessage,
    intent: intent,
    timestamp: timestamp
  };

  await tableClient.createEntity(entity);
  console.log("✅ Chat logged:", entity);
}

module.exports = { logMessage };