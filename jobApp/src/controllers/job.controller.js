import * as jobService from '../services/job.service.js';

export const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};
