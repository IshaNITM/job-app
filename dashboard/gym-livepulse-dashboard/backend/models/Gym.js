import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    opensAt: { type: String, required: true },
    closesAt: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
  },
  { timestamps: true }
);

gymSchema.index({ city: 1, name: 1 });

export default mongoose.model('Gym', gymSchema);
