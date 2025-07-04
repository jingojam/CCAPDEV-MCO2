const express = require('express');
const hbars = require('express-handlebars')
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Handlebars setup
app.engine('handlebars', hbars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


// MongoDB connection string        @LIAM replace this
const mongoURI = 'mongodb://localhost:27017/mydatabase';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static files (optional, useful for CSS/JS/images)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Index', 'index.html'));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
