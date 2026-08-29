
// src/routes/runs.routes.js
const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const {
  createRun, getAllRuns, getRunById, updateRun, deleteRun,
  rsvpToRun, cancelRsvp,
} = require('../controllers/runs.controller');
const { generateCode, redeemCode } = require('../controllers/attendance.controller')
const { redeemLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/', getAllRuns);                              // public
router.get('/:id', getRunById);                            // public
router.post('/', requireAuth, requireAdmin, createRun);    // admin only
router.put('/:id', requireAuth, requireAdmin, updateRun);  // admin only
router.delete('/:id', requireAuth, requireAdmin, deleteRun); // admin only
router.post('/:id/rsvp', requireAuth, rsvpToRun);
router.delete('/:id/rsvp', requireAuth, cancelRsvp);
router.post('/:id/attendance/code', requireAuth, requireAdmin, generateCode)
router.post('/:id/attendance', requireAuth, redeemLimiter, redeemCode)

module.exports = router;