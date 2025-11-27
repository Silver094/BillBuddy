import { Request, Response } from 'express';
import Expense from '../models/Expense';
import Group from '../models/Group';
import { recordActivity } from '../services/activityService';

interface AuthRequest extends Request {
    user?: any;
}

export const addExpense = async (req: AuthRequest, res: Response) => {
    const { description, amount, groupId, splitType, splits, category, date } = req.body;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Verify user is member of group
        const isMember = group.members.some(m => m.toString() === req.user._id.toString());
        if (!isMember) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Validation based on splitType
        if (splitType === 'PERCENTAGE') {
            const totalPercentage = splits.reduce((acc: number, curr: any) => acc + (curr.percentage || 0), 0);
            if (Math.abs(totalPercentage - 100) > 0.01) {
                return res.status(400).json({ message: 'Percentages must add up to 100' });
            }
        } else if (splitType === 'EXACT') {
            const totalAmount = splits.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
            if (Math.abs(totalAmount - amount) > 0.01) {
                return res.status(400).json({ message: 'Split amounts must equal total amount' });
            }
        }

        // If EQUAL, we might just receive a list of users involved, or we can handle it here
        // For MVP, let's assume the client sends the 'splits' array correctly populated with user IDs
        // If splitType is EQUAL and no amounts provided, we can calculate them later or just store the intent.
        // But to keep it simple, let's trust the client sends the structure or we default to group members if empty.

        let finalSplits = splits;
        if (splitType === 'EQUAL' && (!splits || splits.length === 0)) {
            finalSplits = group.members.map(m => ({ user: m }));
        }

        const expense = await Expense.create({
            description,
            amount,
            paidBy: req.user._id,
            group: groupId,
            splitType: splitType || 'EQUAL',
            splits: finalSplits,
            category,
            date: date || new Date(),
        });

        // Record activity
        await recordActivity(
            req.user._id,
            group.members,
            'EXPENSE_ADDED',
            {
                expenseId: expense._id,
                description: expense.description,
                amount: expense.amount,
                groupName: group.name
            }
        );

        res.status(201).json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getGroupExpenses = async (req: AuthRequest, res: Response) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Verify user is member
        const isMember = group.members.some(m => m.toString() === req.user._id.toString());
        if (!isMember) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const expenses = await Expense.find({ group: groupId })
            .populate('paidBy', 'name email')
            .sort({ date: -1 });

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
