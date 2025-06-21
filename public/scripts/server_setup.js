const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.static("public"));

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
