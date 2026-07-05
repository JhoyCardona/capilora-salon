// routes/service.routes.js
const express = require('express');
const router = express.Router();
const {
  createService,
  listServices,
  updateService,
  deleteService,
} = require('../controllers/service.controller');
const authenticateBusiness = require('../middleware/auth.middleware');

// Every route here requires a valid token — a business can only
// manage its own services.
router.post('/', authenticateBusiness, createService);
router.get('/', authenticateBusiness, listServices);
router.put('/:id', authenticateBusiness, updateService);
router.delete('/:id', authenticateBusiness, deleteService);

module.exports = router;