const express = require('express');
const path = require('path');
const app = express();
const ballotRoute = require('./routes/ballotRoute.js');
const PORT = 3000;
require('dotenv').config();

// Middleware to parse form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/ballot', ballotRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
