const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  res.send(`Received: Name = ${name}, Email = ${email}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});