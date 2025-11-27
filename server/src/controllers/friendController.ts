import { Request, Response } from 'express';
import User from '../models/User';
import Friendship from '../models/Friendship';
import { sendEmail } from '../services/emailService';

interface AuthRequest extends Request {
    user?: any;
}

export const sendFriendRequest = async (req: AuthRequest, res: Response) => {
    const { email } = req.body;
    const requesterId = req.user._id;

    try {
        const recipient = await User.findOne({ email });
        if (!recipient) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (recipient._id.toString() === requesterId.toString()) {
            return res.status(400).json({ message: 'Cannot add yourself as a friend' });
        }

        // Check if friendship already exists (in either direction)
        const existingFriendship = await Friendship.findOne({
            $or: [
                { requester: requesterId, recipient: recipient._id },
                { requester: recipient._id, recipient: requesterId }
            ]
        });

        if (existingFriendship) {
            if (existingFriendship.status === 'accepted') {
                return res.status(400).json({ message: 'Already friends' });
            }
            if (existingFriendship.requester.toString() === requesterId.toString()) {
                return res.status(400).json({ message: 'Friend request already sent' });
            }
            return res.status(400).json({ message: 'They already sent you a request' });
        }

        const friendship = await Friendship.create({
            requester: requesterId,
            recipient: recipient._id,
            status: 'pending'
        });

        // Send email notification
        await sendEmail(
            recipient.email,
            'New Friend Request',
            `<p>You have a new friend request from <strong>${req.user.name}</strong>.</p>`
        );

        res.status(201).json(friendship);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const acceptFriendRequest = async (req: AuthRequest, res: Response) => {
    const { friendshipId } = req.body;
    const userId = req.user._id;

    try {
        const friendship = await Friendship.findById(friendshipId);
        if (!friendship) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        if (friendship.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        friendship.status = 'accepted';
        await friendship.save();

        res.json(friendship);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getFriends = async (req: AuthRequest, res: Response) => {
    const userId = req.user._id;

    try {
        const friendships = await Friendship.find({
            $or: [
                { requester: userId, status: 'accepted' },
                { recipient: userId, status: 'accepted' }
            ]
        }).populate('requester', 'name email avatar')
            .populate('recipient', 'name email avatar');

        // Map to just the friend user objects
        const friends = friendships.map(f => {
            if (f.requester._id.toString() === userId.toString()) {
                return f.recipient;
            }
            return f.requester;
        });

        res.json(friends);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPendingRequests = async (req: AuthRequest, res: Response) => {
    const userId = req.user._id;

    try {
        const requests = await Friendship.find({
            recipient: userId,
            status: 'pending'
        }).populate('requester', 'name email avatar');

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const inviteFriend = async (req: AuthRequest, res: Response) => {
    const { email } = req.body;
    const senderName = req.user.name;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. You can send them a friend request.' });
        }

        await sendEmail(
            email,
            'Join BillBuddy!',
            `<p>Hi there!</p>
             <p><strong>${senderName}</strong> has invited you to join <strong>BillBuddy</strong>, the best way to split bills with friends.</p>
             <p><a href="http://localhost:5173/register">Click here to join</a></p>`
        );

        res.json({ message: 'Invitation sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
