const Announcement = require('../models/Announcement');
const User = require('../models/User');
const { sendBatch } = require('../services/mailer');

function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

async function getAllAnnouncements(req, res) {
    try {
        const items = await Announcement.find({
        $or: [
            { date: null },
            { date: { $gte: startOfToday() } },
        ],
        }).sort({ date: 1, createdAt: -1 });

        res.json(items);
    } catch (err) {
        console.error('getAllAnnouncements:', err);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
    }

async function createAnnouncement(req, res) {
    try {
        const { title, description, date, time, location } = req.body;
        if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
        }

        const item = await Announcement.create({
        title,
        description,
        date: date || null,
        time: time || '',
        location: location || '',
        createdBy: req.user.userId,
        });

        res.status(201).json(item);
    } catch (err) {
        console.error('createAnnouncement:', err);
        res.status(500).json({ error: 'Failed to create announcement' });
    }
}

async function getAnnouncementById(req, res) {
    try {
        const item = await Announcement.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Announcement not found' });
        res.json(item);
    } catch (err) {
        console.error('getAnnouncementById:', err);
        res.status(500).json({ error: 'Failed to fetch announcement' });
    }
}

async function updateAnnouncement(req, res) {
    try {
        const { title, description, date, time, location } = req.body;
        const item = await Announcement.findByIdAndUpdate(
        req.params.id,
        { title, description, date: date || null, time: time || '', location: location || '' },
        { new: true, runValidators: true }
        );
        if (!item) return res.status(404).json({ error: 'Announcement not found' });
        res.json(item);
    } catch (err) {
        console.error('updateAnnouncement:', err);
        res.status(500).json({ error: 'Failed to update announcement' });
    }
}

async function deleteAnnouncement(req, res) {
    try {
        const item = await Announcement.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Announcement not found' });
        res.json({ message: 'Announcement deleted' });
    } catch (err) {
        console.error('deleteAnnouncement:', err);
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
}

async function notifyMembers(req, res) {
    try {
        const { subject, body } = req.body;
        if (!subject || !body) {
        return res.status(400).json({ error: 'Subject and body are required' });
        }

        const item = await Announcement.findOneAndUpdate(
        { _id: req.params.id, notifiedAt: null },
        { notifiedAt: new Date() },
        { new: true }
        );

        if (!item) {
        const exists = await Announcement.exists({ _id: req.params.id });
        return exists
            ? res.status(409).json({ error: 'Members have already been notified about this' })
            : res.status(404).json({ error: 'Announcement not found' });
        }

        const allowlist = process.env.MAIL_ALLOWLIST?.split(',').map(s => s.trim()).filter(Boolean);
        const users = await User.find({}, 'email').lean();
        const recipients = users
            .map(u => u.email)
            .filter(Boolean)
            .filter(e => !allowlist?.length || allowlist.includes(e));

        res.status(202).json({ message: 'Sending', recipients: recipients.length });

        sendBatch({ recipients, subject, text: body })
        .then(({ count }) =>
            Announcement.updateOne({ _id: item._id }, { notifiedCount: count ?? 0 })
        )
        .catch(err => console.error('notifyMembers batch failed:', err));
    } catch (err) {
        console.error('notifyMembers:', err);
        res.status(500).json({ error: 'Failed to notify members' });
    }
}

module.exports = {
    getAllAnnouncements,
    createAnnouncement,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
    notifyMembers,
};