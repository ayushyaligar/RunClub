const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { BADGES } = require('../config/badges');

async function getMe(req, res) {
    try {
        const user = await User.findById(req.user.userId).select('name email role totalRuns badges');
        if (!user) return res.status(404).json({ error: 'User not found' });

        const history = await Attendance.find({ user: req.user.userId })
        .sort({ checkedInAt: -1 })
        .limit(20)
        .populate('run', 'title date distanceKm location');

        res.json({
        user,
        badges: BADGES.map(b => ({
            ...b,
            earned: user.badges.includes(b.key),
        })),
        history: history
            .filter(a => a.run)
            .map(a => ({
            _id: a._id,
            checkedInAt: a.checkedInAt,
            run: a.run,
            })),
        });
    } catch (err) {
        console.error('getMe:', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
}

module.exports = { getMe };