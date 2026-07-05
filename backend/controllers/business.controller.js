// controllers/business.controller.js
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('jsonwebtoken');

async function registerBusiness(req, res) {
  const { name, email, password } = req.body;

  // Basic validation: make sure the required fields were actually sent.
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }

  try {
    // Hash the password before storing it. We NEVER store plain text passwords.
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      `INSERT INTO business (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    // Postgres error code 23505 = unique constraint violation (duplicate email).
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A business with this email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Something went wrong registering the business' });
  }
}

async function loginBusiness(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, password_hash FROM business WHERE email = $1',
      [email]
    );

    // If no business was found with that email, we intentionally give the
    // same generic error as a wrong password. This prevents attackers from
    // figuring out which emails are registered in our system.
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const business = result.rows[0];
    const passwordMatches = await bcrypt.compare(password, business.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Credentials are valid: generate a signed JWT containing the business id.
    const token = jwt.sign(
      { businessId: business.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      business: { id: business.id, name: business.name, email: business.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong logging in' });
  }
}

async function getMyBusiness(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM business WHERE id = $1',
      [req.businessId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching business data' });
  }
}

module.exports = { registerBusiness,  loginBusiness, getMyBusiness };