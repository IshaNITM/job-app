import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { ensureSeeded } from './seed/seedRunner.js';
import gymRoutes from './routes/gyms.js';
import memberRoutes from './routes/members.js';
import analyticsRoutes from './routes/analytics.js';
import anomalyRoutes from './routes/anomalies.js';

const PORT = parseInt(process.env.PORT, 10) || 5000;
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mongo: mongoose.connection.readyState === 1 ? 'up' : 'down',
  });
});

app.use('/api/gyms', gymRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/anomalies', anomalyRoutes);

async function start() {
  await connectDB(process.env.MONGODB_URI);
  await ensureSeeded();
  app.listen(PORT, () => console.log(`Gym LivePulse API listening on :${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
