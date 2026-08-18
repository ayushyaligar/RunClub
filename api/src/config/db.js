// Day 1 — mongoose.connect(process.env.MONGO_URI), exported as a function
// that server.js awaits before app.listen().

// src/config/db.js
const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // no point running a server that can't reach its database
    }
}

module.exports = connectDB;