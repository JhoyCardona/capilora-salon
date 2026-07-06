// routes/service.routes.js
const express = require('express');
const router = express.Router();
const {
  createService,
  listServices,
  listPublicServices,
  updateService,
  deleteService,
} = require('../controllers/service.controller');
const authenticateBusiness = require('../middleware/auth.middleware');

// Public route: anyone can see a business's services without logging in.
router.get('/public', listPublicServices);

// Every route here requires a valid token.
router.post('/', authenticateBusiness, createService);
router.get('/', authenticateBusiness, listServices);
router.put('/:id', authenticateBusiness, updateService);
router.delete('/:id', authenticateBusiness, deleteService);

module.exports = router;