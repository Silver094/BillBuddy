import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, UserCheck, UserPlus, Clock, Share2 } from 'lucide-react';
import { ShareModal } from '../components/ShareModal';

interface Friend {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface FriendRequest {
    _id: string;
    requester: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    status: 'pending';
}

const FriendsPage: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [emailToAdd, setEmailToAdd] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchFriends();
        fetchRequests();
    }, []);

    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/friends', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriends(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/friends/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const [showInviteOption, setShowInviteOption] = useState(false);

    const handleAddFriend = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setShowInviteOption(false);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/friends/request',
                { email: emailToAdd },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Friend request sent!');
            setEmailToAdd('');
            setTimeout(() => setShowAddModal(false), 2000);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('User not found. Would you like to share the app with them?');
                setShowInviteOption(true);
            } else {
                setError(err.response?.data?.message || 'Failed to send request');
            }
        }
    };

    const handleAcceptRequest = async (friendshipId: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/friends/accept',
                { friendshipId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchRequests();
            fetchFriends();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Friends</h1>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Share2 size={20} />
                        Share App
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add Friend
                    </button>
                </div>
            </div>

            {/* Pending Requests */}
            {requests.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Clock size={20} />
                        Pending Requests
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {requests.map(req => (
                            <div key={req._id} className="p-4 flex justify-between items-center border-b last:border-0 hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
                                        {req.requester.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{req.requester.name}</p>
                                        <p className="text-sm text-gray-500">{req.requester.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAcceptRequest(req._id)}
                                    className="flex items-center gap-2 bg-teal-50 text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium"
                                >
                                    <UserCheck size={16} />
                                    Accept
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Friends List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {friends.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <UserPlus size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>You haven't added any friends yet.</p>
                    </div>
                ) : (
                    friends.map(friend => (
                        <div key={friend._id} className="p-4 flex items-center gap-3 border-b last:border-0 hover:bg-gray-50">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                {friend.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{friend.name}</p>
                                <p className="text-sm text-gray-500">{friend.email}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Friend Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Add a Friend</h2>
                        <form onSubmit={handleAddFriend}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={emailToAdd}
                                    onChange={(e) => setEmailToAdd(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    placeholder="friend@example.com"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                            {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowInviteOption(false);
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                {showInviteOption ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setShowShareModal(true);
                                        }}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                    >
                                        <Share2 size={16} />
                                        Share Link
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                    >
                                        Send Request
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
            />
        </div>
    );
};

export default FriendsPage;
