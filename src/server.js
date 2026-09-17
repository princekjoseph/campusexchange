const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./config/db');

// 1. Import auth components
const authRoutes = require('./routes/authRoutes');
const { checkUser } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Import listing routes
const listingRoutes = require('./routes/listingRoutes');

// Body & Cookie Parsers (must run before auth checks)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Static Assets & Views
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Global Auth Middleware: populates res.locals.user for every page
app.use(checkUser);

// 3. Mount Routes
app.use(authRoutes);
app.use(listingRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('pages/index');
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost:5432/campusexchange')) {
    try {
      await initDB();
    } catch (err) {
      console.warn('Database initialization skipped/failed:', err.message);
    }
  } else {
    console.log('Skipping local PostgreSQL connection (RDS will be configured next).');
  }
});