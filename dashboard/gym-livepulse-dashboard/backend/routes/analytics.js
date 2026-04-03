import { Router } from 'express';
import {
  getRevenueAnalytics,
  getChurnRisk,
} from '../controllers/analyticsController.js';

const router = Router();

router.get('/revenue', getRevenueAnalytics);
router.get('/churn-risk', getChurnRisk);

export default router;
