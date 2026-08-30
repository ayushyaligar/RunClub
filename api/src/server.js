// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const runRoutes = require('./routes/runs.routes');
const userRoutes = require('./routes/users.routes');
const announcementRoutes = require('./routes/announcements.routes');
const app = express();


connectDB();


app.use(cors());
app.use(express.json()); // parses JSON request bodies into req.body

app.use('/api/auth', authRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/users', userRoutes);
app.use('/api/announcements', announcementRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));