#!/usr/bin/env bash
# Run Club MVP — project scaffold
# Run this from INSIDE your cloned repo folder (the one with .git in it).
# Requires: node + npm + git. On Windows, run it in Git Bash.

set -e

echo "==> Sanity check: are we in a git repo?"
git rev-parse --is-inside-work-tree > /dev/null 2>&1 || {
  echo "ERROR: not inside a git repo. cd into your cloned repo first."
  exit 1
}

# ---------------------------------------------------------------------------
# 1. Root-level files
# ---------------------------------------------------------------------------
echo "==> Creating root files"

cat > .gitignore <<'EOF'
# deps
node_modules/

# secrets — never commit these
.env
.env.local
*.pem

# build output
dist/
build/

# logs
*.log
npm-debug.log*

# editor / OS
.vscode/
.DS_Store
EOF

cat > .env.example <<'EOF'
# Copy this to api/.env for local development:
#   cp .env.example api/.env
# Then fill in real values. api/.env is gitignored.

PORT=5000
MONGO_URI=mongodb://localhost:27017/runclub
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
EOF

cat > README.md <<'EOF'
# Run Club

A run club platform: members RSVP to runs, admins post them, attendance is
self-served via a short-lived code, and each member accumulates total distance,
total runs, and badges.

**Stack:** MongoDB, Express, React (Vite), Node.js. Dockerized for deployment.

## Local setup

```bash
cp .env.example api/.env    # then edit the values

cd api && npm install && npm run dev    # http://localhost:5000
cd web && npm install && npm run dev    # http://localhost:5173
```

You'll need MongoDB running locally on `mongodb://localhost:27017`
(from Day 5 onward, `docker compose up` handles this for you).

## Repo layout

- `api/` — Express REST API
- `web/` — React frontend
- `CONCEPTS.md` — daily writeups (see the pair-learning POA)

## Build log

5-day MVP. See `RunClub-MVP-Plan.md` and `RunClub-Pair-Learning-POA.md`.
EOF

cat > CONCEPTS.md <<'EOF'
# Concepts Log

One entry per build day, written by whoever was navigator more that day.

Format:

## Day N — Topic (written by: name)

**What we built:**

**Why we built it that way:**

**Question that stumped us and how we resolved it:**

**If asked "why" in an interview, the answer is:**

---
EOF

# docker-compose is Day 5 — placeholder so the structure is visible now
cat > docker-compose.yml <<'EOF'
# Day 5. Will run: api + mongo, with a named volume so `docker compose down`
# doesn't wipe the database.
EOF

# ---------------------------------------------------------------------------
# 2. API
# ---------------------------------------------------------------------------
echo "==> Scaffolding api/"

mkdir -p api/src/{config,models,middleware,routes,controllers}

cat > api/package.json <<'EOF'
{
  "name": "run-club-api",
  "version": "1.0.0",
  "private": true,
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
EOF

cat > api/src/server.js <<'EOF'
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
EOF

cat > api/src/config/db.js <<'EOF'
// Day 1 — mongoose.connect(process.env.MONGO_URI), exported as a function
// that server.js awaits before app.listen().
EOF

cat > api/src/models/User.js <<'EOF'
// Day 1 — name, email (unique), passwordHash, role, totalDistanceKm,
// totalRuns, badges[], createdAt
EOF

cat > api/src/models/Run.js <<'EOF'
// Day 2 — title, date, time, location, distanceKm, description, createdBy,
// rsvps[], attended[], attendanceCode, attendanceCodeExpiresAt
EOF

cat > api/src/middleware/auth.js <<'EOF'
// Day 1 — requireAuth (verify JWT, attach req.user), requireAdmin (check role)
EOF

cat > api/src/middleware/rateLimit.js <<'EOF'
// Day 3 — authLimiter, rsvpLimiter, redeemLimiter (express-rate-limit)
EOF

cat > api/src/middleware/errorHandler.js <<'EOF'
// Day 4 — (err, req, res, next) => ... one place that turns thrown errors
// into consistent JSON. Registered LAST in server.js.
EOF

cat > api/src/routes/auth.routes.js <<'EOF'
// Day 1 — POST /register, POST /login
EOF

cat > api/src/routes/runs.routes.js <<'EOF'
// Day 2 — POST /, GET /, GET /:id, PUT /:id, DELETE /:id
// Day 3 — POST /:id/rsvp, DELETE /:id/rsvp
// Day 4 — POST /:id/generate-code, POST /:id/redeem
EOF

cat > api/src/controllers/auth.controller.js <<'EOF'
// Day 1 — register, login
EOF

cat > api/src/controllers/runs.controller.js <<'EOF'
// Day 2-4 — the handler functions the routes delegate to
EOF

cat > api/Dockerfile <<'EOF'
# Day 5. Node base image -> copy package.json -> install -> copy src ->
# EXPOSE -> CMD. No build step (Node runs the source directly).
EOF

cat > api/.dockerignore <<'EOF'
node_modules
.env
*.log
EOF

echo "==> Installing api dependencies"
( cd api && npm install express mongoose bcryptjs jsonwebtoken express-rate-limit cors dotenv \
  && npm install --save-dev nodemon )

# ---------------------------------------------------------------------------
# 3. Web
# ---------------------------------------------------------------------------
echo "==> Scaffolding web/ with Vite"

npm create vite@latest web -- --template react

mkdir -p web/src/{api,pages,context}

cat > web/src/api/client.js <<'EOF'
// Thin fetch wrapper. One place that knows the base URL and attaches the JWT,
// so no page component ever builds a raw fetch call itself.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}
EOF

echo '// Day 1 — register form' > web/src/pages/Register.jsx
echo '// Day 1 — login form' > web/src/pages/Login.jsx
echo '// Day 2 — list of upcoming runs' > web/src/pages/RunsList.jsx
echo '// Day 2 — one run + Day 3 RSVP button + Day 4 code UI' > web/src/pages/RunDetail.jsx
echo '// Day 2 — admin-only create run form' > web/src/pages/AdminCreateRun.jsx
echo '// Day 4 — totals + badges' > web/src/pages/Profile.jsx
echo '// Day 1 — holds { user, token }, login(), logout()' > web/src/context/AuthContext.jsx

cat > web/.env.example <<'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

cat > web/Dockerfile <<'EOF'
# Day 5. Multi-stage: stage 1 builds the Vite app, stage 2 serves the static
# output. The build step is why this differs from api/Dockerfile.
EOF

cat > web/.dockerignore <<'EOF'
node_modules
dist
.env
EOF

echo "==> Installing web dependencies"
( cd web && npm install && npm install react-router-dom )

echo ""
echo "==> Done. Next: verify, then commit."
echo "    cd api && npm run dev     # then open http://localhost:5000/api/health"
