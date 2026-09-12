import { Candidate } from '../models/candidate.model.js';
import { Job } from '../models/job.model.js';
import { calculateOverallMatch } from '../scoring/match.scorer.js';
import { AppError } from '../utils/errors.js';
import { DEFAULT_WEIGHTS } from '../scoring/constants.js';

const parseLimit = (limitStr) => {
  const limit = Number(limitStr);
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new AppError('Limit must be a positive integer', 400, 'INVALID_LIMIT');
  }
  return limit;
};

const validateWeights = (weights) => {
  if (!weights) return DEFAULT_WEIGHTS;

  const { skills, experience, location, salary } = weights;

  if (
    skills === undefined || experience === undefined || 
    location === undefined || salary === undefined
  ) {
    throw new AppError('Custom weights must include skills, experience, location, and salary', 400, 'INVALID_WEIGHTS');
  }

  if (skills < 0 || experience < 0 || location < 0 || salary < 0) {
    throw new AppError('All weights must be non-negative', 400, 'INVALID_WEIGHTS');
  }

  if (skills + experience + location + salary !== 100) {
    throw new AppError('Sum of weights must be exactly 100', 400, 'INVALID_WEIGHTS');
  }

  return weights;
};

export const getCandidateRecommendations = async (candidateId, limitStr = '10', customWeights) => {
  const limit = parseLimit(limitStr);
  const weights = validateWeights(customWeights);

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    throw new AppError('Candidate not found', 404, 'NOT_FOUND');
  }

  const jobs = await Job.find({});
  const recommendations = [];

  for (const job of jobs) {
    const matchResult = calculateOverallMatch(candidate, job, weights);
    
    if (matchResult !== null) {
      recommendations.push({
        jobId: job.id,
        title: job.title,
        score: matchResult.score,
        breakdown: matchResult.breakdown,
      });
    }
  }

  recommendations.sort((a, b) => b.score - a.score);
  return {
    candidateId: candidate.id,
    recommendations: recommendations.slice(0, limit),
  };
};

export const getJobRecommendations = async (jobId, limitStr = '10', customWeights) => {
  const limit = parseLimit(limitStr);
  const weights = validateWeights(customWeights);

  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404, 'NOT_FOUND');
  }

  const candidates = await Candidate.find({});
  const recommendations = [];

  for (const candidate of candidates) {
    const matchResult = calculateOverallMatch(candidate, job, weights);
    
    if (matchResult !== null) {
      recommendations.push({
        candidateId: candidate.id,
        name: candidate.name,
        score: matchResult.score,
        breakdown: matchResult.breakdown,
      });
    }
  }

  recommendations.sort((a, b) => b.score - a.score);
  return {
    jobId: job.id,
    recommendations: recommendations.slice(0, limit),
  };
};
