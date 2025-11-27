import express from 'express';
import { createGroup, getGroups, getGroupById, addMember } from '../controllers/groupController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createGroup);
router.get('/', protect, getGroups);
router.get('/:id', protect, getGroupById);
router.post('/:id/members', protect, addMember);

export default router;
