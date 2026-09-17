const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Body & Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Health check endpoint (essential for AWS EC2 / load balancer checks later)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root Landing Route
app.get('/', (req, res) => {
  res.render('pages/index', { user: null });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  // Only connect to DB if DATABASE_URL is not empty
  if (process.env.DATABASE_URL) {
    await initDB();
  }
});