import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { ActivityFeed } from '../components/ActivityFeed';

const DashboardPage: React.FC = () => {
    const { data: groups } = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const { data } = await api.get('/groups');
            return data;
        },
    });

    return (
        <div className="space-y-8">
            <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to BillBuddy</h1>
                <p className="text-gray-600">Track shared expenses and settle up with friends easily.</p>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Groups</h2>
                    <Link to="/groups" className="text-primary hover:underline flex items-center space-x-1">
                        <span>View all</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {groups && groups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {groups.slice(0, 3).map((group: any) => (
                            <Link to={`/groups/${group._id}`} key={group._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Users size={20} className="text-primary" />
                                    <span className="font-medium text-gray-900">{group.name}</span>
                                </div>
                                <p className="text-sm text-gray-500">{group.members.length} members</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                        <p className="text-gray-500 mb-4">You haven't joined any groups yet.</p>
                        <Link to="/groups" className="text-primary font-medium hover:underline">Create your first group</Link>
                    </div>
                )}
            </div>

            <div>
                <ActivityFeed />
            </div>
        </div>
    );
};

export default DashboardPage;
