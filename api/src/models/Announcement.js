const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date:        { type: Date, default: null },
    time:        { type: String, default: '' },
    location:    { type: String, default: '' },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notifiedAt: { type: Date, default: null },
    notifiedCount: { type: Number, default: 0 },
}, { timestamps: true });

announcementSchema.index({ date: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);