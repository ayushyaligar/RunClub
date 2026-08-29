// Day 2-4 — the handler functions the routes delegate to
// src/controllers/runs.controller.js
const Run = require('../models/Run');

async function createRun(req, res) {
  try {
    const { title, date, time, location, distanceKm, description } = req.body;
    if (!title || !date || !time || !location || distanceKm == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const run = await Run.create({
      title, date, time, location, distanceKm, description,
      createdBy: req.user.userId, // set from the JWT, never trust a client-supplied "createdBy"
    });

    res.status(201).json(run);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create run' });
  }
}

async function getAllRuns(req, res) {
  try {
    const runs = await Run.find().sort({ date: 1 }); // soonest first
    res.json(runs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch runs' });
  }
}

async function getRunById(req, res) {
  try {
    const run = await Run.findById(req.params.id).populate('createdBy', 'name');
    if (!run) return res.status(404).json({ error: 'Run not found' });
    res.json(run);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch run' });
  }
}

async function updateRun(req, res) {
  try {
    const run = await Run.findByIdAndUpdate(req.params.id, req.body, {
      new: true,           // return the updated doc, not the old one
      runValidators: true, // re-run schema validation on update, off by default in Mongoose
    });
    if (!run) return res.status(404).json({ error: 'Run not found' });
    res.json(run);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update run' });
  }
}

async function deleteRun(req, res) {
  try {
    const run = await Run.findByIdAndDelete(req.params.id);
    if (!run) return res.status(404).json({ error: 'Run not found' });
    res.json({ message: 'Run deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete run' });
  }
}

// POST /api/runs/:id/rsvp — any authenticated member
async function rsvpToRun(req, res) {
  try {
    const run = await Run.findById(req.params.id);
    if (!run) return res.status(404).json({ error: 'Run not found' });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (run.date < startOfToday) {
      return res.status(409).json({ error: 'This run has already taken place' });
    }

    // The filter does the duplicate check: only match this run if the user
    // is NOT already in rsvps. One atomic operation, no read-then-write race.
    const updated = await Run.findOneAndUpdate(
      { _id: run._id, rsvps: { $ne: req.user.userId } },
      { $addToSet: { rsvps: req.user.userId } },
      { new: true }
    ).populate('rsvps', 'name email');

    // null means the filter didn't match — the user was already in the array.
    if (!updated) {
      return res.status(409).json({ error: "You have already RSVP'd to this run" });
    }

    res.status(201).json({
      message: 'RSVP confirmed',
      rsvpCount: updated.rsvps.length,
      rsvps: updated.rsvps,
    });
  } catch (err) {
    console.error('rsvpToRun:', err);
    res.status(500).json({ error: 'Failed to RSVP' });
  }
}

// DELETE /api/runs/:id/rsvp — any authenticated member
async function cancelRsvp(req, res) {
  try {
    const run = await Run.findById(req.params.id);
    if (!run) return res.status(404).json({ error: 'Run not found' });

    // Mirror image: only match if the user IS currently in rsvps.
    const updated = await Run.findOneAndUpdate(
      { _id: run._id, rsvps: req.user.userId },
      { $pull: { rsvps: req.user.userId } },
      { new: true }
    ).populate('rsvps', 'name email');

    if (!updated) {
      return res.status(409).json({ error: "You have not RSVP'd to this run" });
    }

    res.json({
      message: 'RSVP cancelled',
      rsvpCount: updated.rsvps.length,
      rsvps: updated.rsvps,
    });
  } catch (err) {
    console.error('cancelRsvp:', err);
    res.status(500).json({ error: 'Failed to cancel RSVP' });
  }
}

// Single export object — do NOT also use `exports.x = ...` above, reassigning
// module.exports here would discard anything attached that way.
module.exports = {
  createRun, getAllRuns, getRunById, updateRun, deleteRun,
  rsvpToRun, cancelRsvp,
};