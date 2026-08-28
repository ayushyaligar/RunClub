// Day 2 — POST /, GET /, GET /:id, PUT /:id, DELETE /:id
// Day 3 — POST /:id/rsvp, DELETE /:id/rsvp
// Day 4 — POST /:id/generate-code, POST /:id/redeem
// src/routes/runs.routes.js
const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const {
  createRun, getAllRuns, getRunById, updateRun, deleteRun,
} = require('../controllers/runs.controller');

const router = express.Router();

router.get('/', getAllRuns);                              // public
router.get('/:id', getRunById);                            // public
router.post('/', requireAuth, requireAdmin, createRun);    // admin only
router.put('/:id', requireAuth, requireAdmin, updateRun);  // admin only
router.delete('/:id', requireAuth, requireAdmin, deleteRun); // admin only

module.exports = router;