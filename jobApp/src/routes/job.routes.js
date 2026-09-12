import { Router } from 'express';
import { createJob } from '../controllers/job.controller.js';
import { getJobRecommendations } from '../controllers/recommendation.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createJobSchema } from '../validations/job.validation.js';

const router = Router();

router.post('/', validate(createJobSchema), createJob);
router.get('/:jobId/recommendations', getJobRecommendations);

export default router;
