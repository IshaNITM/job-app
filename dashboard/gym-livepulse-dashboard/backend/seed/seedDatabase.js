import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { runFullSeed } from './seedRunner.js';

const force =
  process.env.FORCE_SEED === 'true' || process.env.FORCE_SEED === '1';

async function main() {
  await connectDB(process.env.MONGODB_URI);
  try {
    await runFullSeed({ force });
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
