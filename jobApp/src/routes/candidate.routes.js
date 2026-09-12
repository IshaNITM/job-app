import { Router } from 'express';
import { createCandidate } from '../controllers/candidate.controller.js';
import { getCandidateRecommendations } from '../controllers/recommendation.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createCandidateSchema } from '../validations/candidate.validation.js';

const router = Router();

router.post('/', validate(createCandidateSchema), createCandidate);
router.get('/:candidateId/recommendations', getCandidateRecommendations);

export default router;
