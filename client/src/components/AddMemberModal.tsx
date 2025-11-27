import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, groupId }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (email: string) => {
            await api.post(`/groups/${groupId}/members`, { email });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['group', groupId] });
            onClose();
            setEmail('');
            setError('');
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to add member');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            mutation.mutate(email);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Member">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="friend@example.com"
                        required
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Adding...' : 'Add Member'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
