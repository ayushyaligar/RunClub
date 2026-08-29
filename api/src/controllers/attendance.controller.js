// src/controllers/attendance.controller.js
const crypto = require('crypto');
const Run = require('../models/Run');

const CODE_TTL_MINUTES = 30;

exports.generateCode = async (req, res) => {
    try {
        const run = await Run.findById(req.params.id);
        if (!run) return res.status(404).json({ message: 'Run not found' });

        const code = String(crypto.randomInt(100000, 1000000));
        const codeExpiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

        run.attendanceCode = code;
        run.codeExpiresAt = codeExpiresAt;
        await run.save();

        return res.status(200).json({ code, expiresAt: codeExpiresAt });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { badgesFor } = require('../config/badges');

exports.redeemCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ message: 'Code is required' });

        const run = await Run.findById(req.params.id).select('+attendanceCode +codeExpiresAt');
        if (!run) return res.status(404).json({ message: 'Run not found' });

        const valid =
        run.attendanceCode &&
        run.codeExpiresAt > new Date() &&
        String(code) === run.attendanceCode;

        if (!valid) return res.status(400).json({ message: 'Invalid or expired code' });

        try {
        await Attendance.create({ run: run._id, user: req.user.userId });
        } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Already checked in' });
        }
        throw err;
        }

        const counted = await User.findByIdAndUpdate(
        req.user.userId,
        { $inc: { totalRuns: 1 } },
        { new: true }
        );

        const updated = await User.findByIdAndUpdate(
        req.user.userId,
        { $addToSet: { badges: { $each: badgesFor(counted.totalRuns) } } },
        { new: true }
        );

        return res.status(201).json({
        message: 'Checked in',
        totalRuns: updated.totalRuns,
        badges: updated.badges,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};