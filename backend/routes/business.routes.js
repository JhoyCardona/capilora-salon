// routes/business.routes.js
const express = require('express');
const router = express.Router();
const { registerBusiness, loginBusiness, getMyBusiness } = require('../controllers/business.controller');
const authenticateBusiness = require('../middleware/auth.middleware');

router.post('/register', registerBusiness);
router.post('/login', loginBusiness);
router.get('/me', authenticateBusiness, getMyBusiness);

module.exports = router;