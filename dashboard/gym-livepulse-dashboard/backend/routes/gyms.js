import { Router } from 'express';
import {
  getGyms,
  getGymById,
  getGymOccupancy,
} from '../controllers/gymController.js';

const router = Router();

router.get('/', getGyms);
router.get('/:id/occupancy', getGymOccupancy);
router.get('/:id', getGymById);

export default router;
