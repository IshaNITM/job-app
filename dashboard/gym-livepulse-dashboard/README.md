# Gym LivePulse Dashboard

MERN stack demo: seeded WTF Gyms network (10 clubs, 5k members, ~270k check-ins) with analytics APIs and a React operations dashboard.

## Quick start (Docker)

```bash
docker compose up --build
```

- Dashboard: http://localhost:3000 (nginx proxies `/api` to the API)
- API directly: http://localhost:5000/api/health

The API auto-seeds when MongoDB has no gyms (`AUTO_SEED_IF_EMPTY`).

## Local development

**MongoDB** must be running (local or Docker only mongo).

```bash
# terminal 1 — database
docker compose up mongo

# terminal 2 — API
cd backend
cp ../.env.example .env   # optional; defaults work with local mongo
npm install
npm run seed              # optional manual seed; empty DB also seeds on server start
npm run dev

# terminal 3 — UI
cd frontend
npm install
npm start                 # or: npm run dev — http://localhost:5173, proxies /api → :5000
```

### MongoDB Atlas

Put your SRV URI in `backend/.env` as `MONGODB_URI`. If the password contains `#`, `@`, or `/`, you must **percent-encode** it (e.g. `#` → `%23`). The app uses database name `gym_livepulse` in the path. In Atlas, allow your IP (or `0.0.0.0/0` for dev) under **Network Access**.

Force full reseed (wipes collections):

```bash
cd backend
FORCE_SEED=true npm run seed
```

## API

| Method | Path |
|--------|------|
| GET | `/api/gyms` |
| GET | `/api/gyms/:id` |
| GET | `/api/gyms/:id/occupancy` |
| GET | `/api/members?page=1&limit=25&gymId=` |
| GET | `/api/analytics/revenue?gymId=` |
| GET | `/api/analytics/churn-risk` |
| GET | `/api/anomalies` |

## Project layout

- `backend/` — Express, Mongoose models, batched seed, anomaly rules
- `frontend/` — Vite, React Router, Recharts
