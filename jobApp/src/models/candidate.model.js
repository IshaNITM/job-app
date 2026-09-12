import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
      validate: [
        {
          validator: (v) => Array.isArray(v),
          message: 'Skills must be an array of strings',
        },
      ],
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: [0, 'Years of experience cannot be negative'],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    expectedSalary: {
      type: Number,
      required: true,
      min: [0, 'Expected salary cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Candidate = mongoose.model('Candidate', candidateSchema);
