import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { Plus, Receipt, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { SettleUpModal } from '../components/SettleUpModal';
import { AddMemberModal } from '../components/AddMemberModal';
import { clsx } from 'clsx';

interface Member {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface Expense {
    _id: string;
    description: string;
    amount: number;
    paidBy: Member;
    date: string;
    category: string;
}

interface Balance {
    userId: string;
    amount: number;
}

const GroupDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const { user } = useAuth();

    const { data: group } = useQuery({
        queryKey: ['group', id],
        queryFn: async () => {
            const { data } = await api.get(`/groups/${id}`);
            return data;
        },
        enabled: !!id,
    });

    const { data: expenses } = useQuery({
        queryKey: ['group-expenses', id],
        queryFn: async () => {
            const { data } = await api.get<Expense[]>(`/expenses/group/${id}`);
            return data;
        },
        enabled: !!id,
    });

    const { data: balances } = useQuery({
        queryKey: ['group-balances', id],
        queryFn: async () => {
            const { data } = await api.get<Balance[]>(`/balances/group/${id}`);
            return data;
        },
        enabled: !!id,
    });

    if (!group) return <div>Loading...</div>;

    const getUserBalance = (userId: string) => {
        const balance = balances?.find(b => b.userId === userId);
        return balance ? balance.amount : 0;
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h1>
                    <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                            {group.members.map((member: Member) => (
                                <div key={member._id} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600" title={member.name}>
                                    {member.name.charAt(0)}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsAddMemberModalOpen(true)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            title="Add Member"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                    <Button variant="secondary" onClick={() => setIsSettleModalOpen(true)} className="flex-1 md:flex-none justify-center">Settle Up</Button>
                    <Button onClick={() => setIsExpenseModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center space-x-2">
                        <Plus size={18} />
                        <span>Add Expense</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Expenses List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Expenses</h2>
                    {expenses?.map((expense) => (
                        <div key={expense._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                    <Receipt size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{expense.description}</h3>
                                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                                        <span className="flex items-center">
                                            <User size={12} className="mr-1" />
                                            {expense.paidBy.name} paid
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center">
                                            <Calendar size={12} className="mr-1" />
                                            {format(new Date(expense.date), 'MMM d')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">₹{expense.amount.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">{expense.category}</p>
                            </div>
                        </div>
                    ))}
                    {expenses?.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                            <p className="text-gray-500">No expenses yet.</p>
                        </div>
                    )}
                </div>

                {/* Balances Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Balances</h2>
                        <div className="space-y-4">
                            {group.members.map((member: Member) => {
                                const balance = getUserBalance(member._id);
                                return (
                                    <div key={member._id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                                                {member.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">
                                                {member._id === user?._id ? 'You' : member.name}
                                            </span>
                                        </div>
                                        <span className={clsx(
                                            "text-sm font-bold",
                                            balance > 0 ? "text-green-600" : balance < 0 ? "text-red-600" : "text-gray-400"
                                        )}>
                                            {balance > 0 ? `gets back ₹${balance.toFixed(2)}` : balance < 0 ? `owes ₹${Math.abs(balance).toFixed(2)}` : "settled"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <AddExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                groupId={id!}
                members={group.members}
            />

            <SettleUpModal
                isOpen={isSettleModalOpen}
                onClose={() => setIsSettleModalOpen(false)}
                groupId={id!}
                members={group.members}
            />

            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
                groupId={id!}
            />
        </div>
    );
};

export default GroupDetailsPage;
