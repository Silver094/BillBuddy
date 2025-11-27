import express from 'express';
import { addExpense, getGroupExpenses } from '../controllers/expenseController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, addExpense);
router.get('/group/:groupId', protect, getGroupExpenses);

export default router;
