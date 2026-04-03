import mongoose from 'mongoose';

const anomalySchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['zero_checkins', 'capacity_breach', 'revenue_drop'],
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ['warning', 'low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    message: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    detectedAt: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

anomalySchema.index({ resolved: 1, detectedAt: -1 });

export default mongoose.model('Anomaly', anomalySchema);
