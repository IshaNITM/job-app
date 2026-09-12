import * as recommendationService from '../services/recommendation.service.js';
import { Types } from 'mongoose';
import { AppError } from '../utils/errors.js';

export const getCandidateRecommendations = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    const limit = req.query.limit || '10';
    // Expecting custom weights as JSON string in query for simplicity, or in body
    // Since it's a GET request, it's better to accept weights via a query param `weights` encoded as JSON.
    let weights;
    if (req.query.weights) {
      try {
        weights = JSON.parse(req.query.weights);
      } catch (e) {
        throw new AppError('Invalid JSON format for weights', 400, 'INVALID_WEIGHTS');
      }
    }

    if (!Types.ObjectId.isValid(candidateId)) {
      throw new AppError('Invalid candidate ID format', 400, 'INVALID_ID');
    }

    const data = await recommendationService.getCandidateRecommendations(candidateId, limit, weights);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobRecommendations = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const limit = req.query.limit || '10';
    
    let weights;
    if (req.query.weights) {
      try {
        weights = JSON.parse(req.query.weights);
      } catch (e) {
        throw new AppError('Invalid JSON format for weights', 400, 'INVALID_WEIGHTS');
      }
    }

    if (!Types.ObjectId.isValid(jobId)) {
      throw new AppError('Invalid job ID format', 400, 'INVALID_ID');
    }

    const data = await recommendationService.getJobRecommendations(jobId, limit, weights);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
