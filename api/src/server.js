require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json()); // parses JSON request bodies into req.body

// Health check — hit this to confirm the server is alive before anything else exists.
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Day 1: app.use('/api/auth', require('./routes/auth.routes'));
// Day 2: app.use('/api/runs', require('./routes/runs.routes'));
// Day 4: app.use(require('./middleware/errorHandler'));  // must be LAST

const PORT = process.env.PORT || 5000;

// Day 1: connect to Mongo first, then listen.
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
