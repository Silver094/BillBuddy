import express from 'express';
import { sendFriendRequest, acceptFriendRequest, getFriends, getPendingRequests, inviteFriend } from '../controllers/friendController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/request', protect, sendFriendRequest);
router.post('/invite', protect, inviteFriend);
router.put('/accept', protect, acceptFriendRequest);
router.get('/', getFriends);
router.get('/pending', getPendingRequests);

export default router;
