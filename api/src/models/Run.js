// Day 2 — title, date, time, location, distanceKm, description, createdBy,
// rsvps[], attended[], attendanceCode, attendanceCodeExpiresAt
// src/models/Run.js
const mongoose = require('mongoose');

const runSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  distanceKm: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rsvps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

runSchema.index({ rsvps: 1 });

module.exports = mongoose.model('Run', runSchema);