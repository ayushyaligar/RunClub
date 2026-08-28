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
      new: true,        // return the updated doc, not the old one
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

module.exports = { createRun, getAllRuns, getRunById, updateRun, deleteRun };