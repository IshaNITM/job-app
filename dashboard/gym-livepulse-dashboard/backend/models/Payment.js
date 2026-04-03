import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
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
    amount: { type: Number, required: true, min: 0 },
    paymentType: {
      type: String,
      enum: ['new', 'renewal'],
      required: true,
    },
    paidAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

paymentSchema.index({ gymId: 1, paidAt: -1 });

export default mongoose.model('Payment', paymentSchema);
