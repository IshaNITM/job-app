import { Job } from '../models/job.model.js';

export const createJob = async (jobData) => {
  const job = new Job(jobData);
  await job.save();
  return job;
};
