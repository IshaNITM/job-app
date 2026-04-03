import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
      index: true,
    },
    planType: {
      type: String,
      enum: ['monthly', 'quarterly', 'annual'],
      required: true,
    },
    memberType: {
      type: String,
      enum: ['new', 'renewal'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'frozen'],
      required: true,
      index: true,
    },
    joinedAt: { type: Date, required: true },
    planExpiresAt: { type: Date, required: true },
    lastCheckinAt: { type: Date, default: null },
    churnRiskTier: {
      type: String,
      enum: ['none', 'high', 'critical'],
      default: 'none',
      index: true,
    },
  },
  { timestamps: true }
);

memberSchema.index({ gymId: 1, status: 1 });

export default mongoose.model('Member', memberSchema);
