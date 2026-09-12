import * as candidateService from '../services/candidate.service.js';

export const createCandidate = async (req, res, next) => {
  try {
    const candidate = await candidateService.createCandidate(req.body);
    res.status(201).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};
