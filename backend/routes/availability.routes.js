// routes/availability.routes.js
const express = require('express');
const router = express.Router();
const {
  createAvailability,
  listAvailability,
  deleteAvailability,
  getAvailableSlots,
} = require('../controllers/availability.controller');
const authenticateBusiness = require('../middleware/auth.middleware');

// Public route: an end customer needs to see available slots without logging in.
router.get('/slots', getAvailableSlots);

router.post('/', authenticateBusiness, createAvailability);
router.get('/', authenticateBusiness, listAvailability);
router.delete('/:id', authenticateBusiness, deleteAvailability);

module.exports = router;