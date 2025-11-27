import { Request, Response } from 'express';
import Expense from '../models/Expense';
import Group from '../models/Group';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
    user?: any;
}

interface Balance {
    [userId: string]: number;
}

export const getGroupBalances = async (req: AuthRequest, res: Response) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const expenses = await Expense.find({ group: groupId });
        const balances: Balance = {};

        // Helper to ensure user exists in balances
        const ensureUser = (userId: string) => {
            if (balances[userId] === undefined) {
                balances[userId] = 0;
            }
        };

        // Initialize balances for all current members
        group.members.forEach(member => {
            ensureUser(member.toString());
        });

        expenses.forEach(expense => {
            const amount = expense.amount;
            const paidBy = expense.paidBy.toString();

            // Payer gets positive balance (owed to them)
            ensureUser(paidBy);
            balances[paidBy] += amount;

            // Calculate split amounts based on type
            if (expense.splitType === 'EQUAL') {
                const splitCount = expense.splits.length;
                if (splitCount > 0) {
                    const splitAmount = amount / splitCount;
                    expense.splits.forEach(split => {
                        const id = split.user.toString();
                        ensureUser(id);
                        balances[id] -= splitAmount;
                    });
                }
            } else if (expense.splitType === 'PERCENTAGE') {
                expense.splits.forEach(split => {
                    const id = split.user.toString();
                    const splitAmount = (amount * (split.percentage || 0)) / 100;
                    ensureUser(id);
                    balances[id] -= splitAmount;
                });
            } else if (expense.splitType === 'SHARES') {
                const totalShares = expense.splits.reduce((acc, curr) => acc + (curr.shares || 0), 0);
                if (totalShares > 0) {
                    expense.splits.forEach(split => {
                        const id = split.user.toString();
                        const splitAmount = (amount * (split.shares || 0)) / totalShares;
                        ensureUser(id);
                        balances[id] -= splitAmount;
                    });
                }
            } else if (expense.splitType === 'EXACT') {
                expense.splits.forEach(split => {
                    const id = split.user.toString();
                    const splitAmount = split.amount || 0;
                    ensureUser(id);
                    balances[id] -= splitAmount;
                });
            }
        });

        // Format for response
        const formattedBalances = Object.keys(balances).map(userId => ({
            userId,
            amount: Number(balances[userId].toFixed(2)),
        }));

        res.json(formattedBalances);
    } catch (error) {
        console.error('Error calculating balances:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
