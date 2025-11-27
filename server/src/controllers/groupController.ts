import { Request, Response } from 'express';
import Group from '../models/Group';
import User from '../models/User';
import { recordActivity } from '../services/activityService';
import { sendEmail } from '../services/emailService';

interface AuthRequest extends Request {
    user?: any;
}

export const createGroup = async (req: AuthRequest, res: Response) => {
    const { name, members } = req.body; // members is array of emails

    try {
        const memberIds = [req.user._id];

        if (members && members.length > 0) {
            const users = await User.find({ email: { $in: members } });
            users.forEach(user => {
                if (user._id.toString() !== req.user._id.toString()) {
                    memberIds.push(user._id);
                }
            });
        }

        const group = await Group.create({
            name,
            creator: req.user._id,
            members: memberIds,
        });

        await recordActivity(
            req.user._id,
            memberIds,
            'GROUP_CREATED',
            { groupId: group._id, groupName: group.name }
        );

        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getGroups = async (req: AuthRequest, res: Response) => {
    try {
        const groups = await Group.find({ members: req.user._id })
            .populate('members', 'name email avatar')
            .sort({ createdAt: -1 });
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getGroupById = async (req: AuthRequest, res: Response) => {
    try {
        const group = await Group.findById(req.params.id).populate('members', 'name email avatar');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is member
        const isMember = group.members.some(member => member._id.toString() === req.user._id.toString());
        if (!isMember) {
            return res.status(403).json({ message: 'Not authorized to view this group' });
        }

        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const addMember = async (req: AuthRequest, res: Response) => {
    const { email } = req.body;
    const { id } = req.params;

    try {
        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is member (only members can add others)
        const isMember = group.members.some(m => m.toString() === req.user._id.toString());
        if (!isMember) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const userToAdd = await User.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already member
        if (group.members.some(m => m.toString() === userToAdd._id.toString())) {
            return res.status(400).json({ message: 'User already in group' });
        }

        group.members.push(userToAdd._id);
        await group.save();

        await recordActivity(
            req.user._id,
            group.members,
            'MEMBER_ADDED',
            {
                groupId: group._id,
                groupName: group.name,
                addedUser: userToAdd.name
            }
        );

        // Send email notification
        await sendEmail(
            userToAdd.email,
            'Added to Group',
            `<p>You have been added to the group <strong>${group.name}</strong> by ${req.user.name}.</p>`
        );

        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
