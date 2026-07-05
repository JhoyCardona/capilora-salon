// index.js
// Entry point of the backend server.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const businessRoutes = require('./routes/business.routes');
const serviceRoutes = require('./routes/service.routes');
const availabilityRoutes = require('./routes/availability.routes');
const bookingRoutes = require('./routes/booking.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/business', businessRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check route: confirms the server AND the database are both working.
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      server: 'running',
      database: 'connected',
      db_time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      server: 'running',
      database: 'not connected',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});