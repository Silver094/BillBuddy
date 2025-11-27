import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { formatDistanceToNow } from 'date-fns';
import { Receipt, UserPlus, Users, Activity as ActivityIcon } from 'lucide-react';

interface Activity {
    _id: string;
    user: {
        name: string;
        avatar?: string;
    };
    type: string;
    data: any;
    createdAt: string;
}

export const ActivityFeed: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const { data } = await api.get('/activity');
                setActivities(data);
            } catch (error) {
                console.error('Failed to fetch activity feed', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) return <div className="p-4 text-center text-gray-500">Loading activity...</div>;

    const getIcon = (type: string) => {
        switch (type) {
            case 'EXPENSE_ADDED': return <Receipt size={16} className="text-orange-500" />;
            case 'GROUP_CREATED': return <Users size={16} className="text-blue-500" />;
            case 'MEMBER_ADDED': return <UserPlus size={16} className="text-green-500" />;
            default: return <ActivityIcon size={16} className="text-gray-500" />;
        }
    };

    const renderMessage = (activity: Activity) => {
        const { user, type, data } = activity;
        const name = <span className="font-semibold text-gray-900">{user.name}</span>;

        switch (type) {
            case 'EXPENSE_ADDED':
                return (
                    <span>
                        {name} added <strong>"{data.description}"</strong> in <strong>{data.groupName}</strong> for ₹{data.amount}
                    </span>
                );
            case 'GROUP_CREATED':
                return (
                    <span>
                        {name} created the group <strong>"{data.groupName}"</strong>
                    </span>
                );
            case 'MEMBER_ADDED':
                return (
                    <span>
                        {name} added <strong>{data.addedUser}</strong> to <strong>{data.groupName}</strong>
                    </span>
                );
            default:
                return <span>{name} performed an action</span>;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <ActivityIcon size={20} className="text-teal-600" />
                <h2 className="font-semibold text-gray-800">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {activities.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">No recent activity</div>
                ) : (
                    activities.map(activity => (
                        <div key={activity._id} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors">
                            <div className="mt-1 min-w-[32px] h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                {getIcon(activity.type)}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {renderMessage(activity)}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
