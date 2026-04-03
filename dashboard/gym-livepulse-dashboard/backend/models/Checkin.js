import mongoose from 'mongoose';

const checkinSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
      index: true,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
      index: true,
    },
    checkedIn: { type: Date, required: true, index: true },
    checkedOut: { type: Date, default: null },
  },
  { timestamps: true }
);

checkinSchema.index({ gymId: 1, checkedOut: 1 });
checkinSchema.index({ checkedIn: -1 });

export default mongoose.model('Checkin', checkinSchema);
