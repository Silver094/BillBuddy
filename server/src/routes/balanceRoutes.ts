import express from 'express';
import { getGroupBalances } from '../controllers/balanceController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/group/:groupId', protect, getGroupBalances);

export default router;
