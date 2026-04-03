import mongoose from 'mongoose';

export async function connectDB(uri) {
  const mongoUri =
    uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gym_livepulse';
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, { maxPoolSize: 50 });
  return mongoose.connection;
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
