import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { clsx } from 'clsx';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    members: { _id: string; name: string }[];
}

interface ExpenseForm {
    description: string;
    amount: number;
    category: string;
    date: string;
}

type SplitType = 'EQUAL' | 'PERCENTAGE' | 'SHARES' | 'EXACT';

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, groupId, members }) => {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ExpenseForm>();
    const queryClient = useQueryClient();

    const [splitType, setSplitType] = useState<SplitType>('EQUAL');
    const [splitValues, setSplitValues] = useState<Record<string, number>>({});
    const [validationError, setValidationError] = useState('');

    const amount = watch('amount') || 0;

    // Reset split values when modal opens or members change
    useEffect(() => {
        if (isOpen) {
            const initialSplits: Record<string, number> = {};
            members.forEach(m => initialSplits[m._id] = 0);
            setSplitValues(initialSplits);
            setSplitType('EQUAL');
            setValidationError('');
        }
    }, [isOpen, members]);

    const handleSplitChange = (userId: string, value: string) => {
        setSplitValues(prev => ({
            ...prev,
            [userId]: parseFloat(value) || 0
        }));
    };

    const validateSplits = () => {
        if (splitType === 'EQUAL') return true;

        if (splitType === 'PERCENTAGE') {
            const total = Object.values(splitValues).reduce((a, b) => a + b, 0);
            if (Math.abs(total - 100) > 0.1) {
                setValidationError(`Total percentage is ${total}%, must be 100%`);
                return false;
            }
        }

        if (splitType === 'EXACT') {
            const total = Object.values(splitValues).reduce((a, b) => a + b, 0);
            if (Math.abs(total - amount) > 0.1) {
                setValidationError(`Total split amount is ${total}, must be ${amount}`);
                return false;
            }
        }

        setValidationError('');
        return true;
    };

    const mutation = useMutation({
        mutationFn: async (data: ExpenseForm) => {
            const splits = members.map(m => {
                const val = splitValues[m._id] || 0;
                if (splitType === 'EQUAL') return { user: m._id };
                if (splitType === 'PERCENTAGE') return { user: m._id, percentage: val };
                if (splitType === 'SHARES') return { user: m._id, shares: val };
                if (splitType === 'EXACT') return { user: m._id, amount: val };
                return { user: m._id };
            });

            // Filter out users with 0 shares/percentage/amount if needed, 
            // but for now keeping everyone in the splits array is safer for the backend logic

            await api.post('/expenses', {
                ...data,
                groupId,
                splitType,
                splits,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['group-expenses', groupId] });
            queryClient.invalidateQueries({ queryKey: ['group-balances', groupId] });
            reset();
            onClose();
        },
    });

    const onSubmit = (data: ExpenseForm) => {
        if (validateSplits()) {
            mutation.mutate(data);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add an expense">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                        {...register('description', { required: 'Description is required' })}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g. Dinner at Burger King"
                    />
                    {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">₹</span>
                        <input
                            {...register('amount', { required: 'Amount is required', min: 1 })}
                            type="number"
                            step="0.01"
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="0.00"
                        />
                    </div>
                    {errors.amount && <span className="text-red-500 text-xs">{errors.amount.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            {...register('category')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="General">General</option>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Entertainment">Entertainment</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            {...register('date')}
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Split Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Split Method</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                        {(['EQUAL', 'PERCENTAGE', 'SHARES', 'EXACT'] as SplitType[]).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setSplitType(type)}
                                className={clsx(
                                    "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                                    splitType === type ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {type.charAt(0) + type.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    {/* Split Inputs */}
                    {splitType !== 'EQUAL' && (
                        <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                            {members.map(member => (
                                <div key={member._id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700">{member.name}</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={splitValues[member._id] || ''}
                                            onChange={(e) => handleSplitChange(member._id, e.target.value)}
                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-primary"
                                            placeholder="0"
                                        />
                                        <span className="text-gray-500 w-4">
                                            {splitType === 'PERCENTAGE' ? '%' : splitType === 'SHARES' ? 'pts' : '₹'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {validationError && (
                        <p className="text-red-500 text-xs mt-2">{validationError}</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Adding...' : 'Save'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
