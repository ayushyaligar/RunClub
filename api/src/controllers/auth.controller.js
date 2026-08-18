// Day 1 — register, login
// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
        return res.status(400).json({ error: 'name, email, and password are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10); // 10 = salt rounds, see theory §6
        const user = await User.create({ name, email, passwordHash });

        res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
        // deliberately NOT sending passwordHash back, ever
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
}

module.exports = { register, login };