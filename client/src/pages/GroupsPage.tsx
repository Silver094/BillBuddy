import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Group {
    _id: string;
    name: string;
    members: { _id: string; name: string; avatar?: string }[];
}

const GroupsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const queryClient = useQueryClient();

    const { data: groups, isLoading } = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const { data } = await api.get<Group[]>('/groups');
            return data;
        },
    });

    const createGroupMutation = useMutation({
        mutationFn: async (name: string) => {
            await api.post('/groups', { name });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            setIsModalOpen(false);
            setNewGroupName('');
        },
    });

    const handleCreateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGroupName.trim()) {
            createGroupMutation.mutate(newGroupName);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Your Groups</h1>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
                    <Plus size={20} />
                    <span>Create Group</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups?.map((group) => (
                    <Link to={`/groups/${group._id}`} key={group._id} className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{group.name}</h3>
                                    <p className="text-sm text-gray-500">{group.members.length} members</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create a new group">
                <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                        <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="e.g. Trip to Goa"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={createGroupMutation.isPending}>
                            {createGroupMutation.isPending ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default GroupsPage;
