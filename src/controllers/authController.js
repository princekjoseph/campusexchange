const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const maxAge = 3 * 24 * 60 * 60; // 3 days

const createToken = (id, name, email, college) => {
  return jwt.sign({ id, name, email, college }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// Render Pages
exports.getRegister = (req, res) => res.render('pages/register', { error: null });
exports.getLogin = (req, res) => res.render('pages/login', { error: null });

// Handle Registration
exports.postRegister = async (req, res) => {
  const { name, email, college, department, year, phone, password } = req.body;

  try {
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.render('pages/register', { error: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users (name, email, college, department, year, phone, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, college`,
      [name, email, college, department, year, phone, hashedPassword]
    );

    const user = newUser.rows[0];
    const token = createToken(user.id, user.name, user.email, user.college);

    res.cookie('token', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect('/listings');
  } catch (err) {
    console.error(err);
    res.render('pages/register', { error: 'Registration failed. Try again.' });
  }
};

// Handle Login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.render('pages/login', { error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const auth = await bcrypt.compare(password, user.password_hash);
    if (!auth) {
      return res.render('pages/login', { error: 'Invalid credentials' });
    }

    const token = createToken(user.id, user.name, user.email, user.college);
    res.cookie('token', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect('/listings');
  } catch (err) {
    console.error(err);
    res.render('pages/login', { error: 'Login error occurred.' });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};