import express from 'express';
import { getActivityFeed } from '../controllers/activityController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getActivityFeed);

export default router;
