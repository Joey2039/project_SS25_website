const express = require('express');
    const bodyParser = require('body-parser');
    const fs = require('fs');
    const path = require('path');

    const app = express();
    const PORT = 3000;

    // Middleware
    app.use(bodyParser.json());
    app.use(express.static('public')); // Serve static files

    // Endpoint to handle form submissions
    app.post('/save-input', (req, res) => {
        const userData = req.body;

        // Path to JSON file
        const jsonFilePath = path.join(__dirname, 'userData.json');

        // Save to JSON file
        fs.writeFile(jsonFilePath, JSON.stringify(userData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).send('User data saved!');
        });
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });