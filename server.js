const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./routes'); // Import routes from routes.js

// Middleware to parse JSON bodies
app.use(express.json());

// Use the routes defined in routes.js
app.use('/api', routes);  


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});     