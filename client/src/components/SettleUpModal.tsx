import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

interface SettleUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    members: { _id: string; name: string }[];
}

export const SettleUpModal: React.FC<SettleUpModalProps> = ({ isOpen, onClose, groupId, members }) => {
    const { user } = useAuth();
    const [payeeId, setPayeeId] = useState('');
    const [amount, setAmount] = useState('');
    const queryClient = useQueryClient();

    // Filter out current user from potential payees
    const otherMembers = members.filter(m => m._id !== user?._id);

    const mutation = useMutation({
        mutationFn: async () => {
            await api.post('/expenses', {
                description: 'Settlement',
                amount: parseFloat(amount),
                groupId,
                splitBetween: [payeeId], // Split entirely by payee
                category: 'Settlement',
                date: new Date().toISOString(),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['group-expenses', groupId] });
            queryClient.invalidateQueries({ queryKey: ['group-balances', groupId] });
            onClose();
            setAmount('');
            setPayeeId('');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (payeeId && amount) {
            mutation.mutate();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settle Up">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-4">
                    <p className="text-gray-600">You paid</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <select
                        value={payeeId}
                        onChange={(e) => setPayeeId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    >
                        <option value="">Select a person</option>
                        {otherMembers.map(member => (
                            <option key={member._id} value={member._id}>{member.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Processing...' : 'Settle Up'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
