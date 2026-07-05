// routes/booking.routes.js
const express = require('express');
const router = express.Router();
const { createBooking, listBookings, cancelBooking } = require('../controllers/booking.controller');
const authenticateBusiness = require('../middleware/auth.middleware');

// Public route: any end customer can create a booking, no login needed.
router.post('/', createBooking);

// Protected routes: only the business owner can view/manage its bookings.
router.get('/', authenticateBusiness, listBookings);
router.patch('/:id/cancel', authenticateBusiness, cancelBooking);

module.exports = router;