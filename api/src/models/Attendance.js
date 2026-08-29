const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema({
    run:  { type: mongoose.Schema.Types.ObjectId, ref: 'Run',  required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkedInAt: { type: Date, default: Date.now },
}, { timestamps: true })

attendanceSchema.index({ run: 1, user: 1 }, { unique: true })
attendanceSchema.index({ user: 1, checkedInAt: -1 })

module.exports = mongoose.model('Attendance', attendanceSchema)