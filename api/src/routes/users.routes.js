const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getMe } = require('../controllers/users.controller');

const router = express.Router();
router.get('/me', requireAuth, getMe);

module.exports = router;