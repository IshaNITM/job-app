import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['must-have', 'nice-to-have'],
    },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    requiredSkills: {
      type: [skillSchema],
      required: true,
      validate: [
        {
          validator: (v) => Array.isArray(v),
          message: 'Required skills must be an array',
        },
      ],
    },
    minYearsExperience: {
      type: Number,
      required: true,
      min: [0, 'Minimum years of experience cannot be negative'],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salaryRange: {
      min: {
        type: Number,
        required: true,
        min: [0, 'Salary min cannot be negative'],
      },
      max: {
        type: Number,
        required: true,
        min: [0, 'Salary max cannot be negative'],
      },
    },
    remoteAllowed: {
      type: Boolean,
      required: true,
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

// Add custom validator to ensure min <= max for salary
jobSchema.pre('validate', function (next) {
  if (this.salaryRange && this.salaryRange.min > this.salaryRange.max) {
    this.invalidate(
      'salaryRange',
      'Salary minimum cannot exceed salary maximum'
    );
  }
  next();
});

export const Job = mongoose.model('Job', jobSchema);
