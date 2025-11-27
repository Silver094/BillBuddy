import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Edit2, LogOut } from 'lucide-react';
import { format } from 'date-fns';

const ProfilePage: React.FC = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [loading, setLoading] = useState(false);

    if (!user) return null;

    const handleEditClick = () => {
        setEditName(user.name);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditName('');
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            // Assuming we have an api instance or using axios directly
            // Ideally should use the api instance from lib/api but for now using axios or fetch if api not imported
            // Checking imports... api is not imported in original file, but used in AuthContext.
            // Let's import axios for now or better yet, check if api is available.
            // Since I can't see imports in this chunk, I'll assume I need to add imports.
            // Wait, I should add imports in a separate chunk or use a multi-replace if possible.
            // For now, I'll use fetch or assume axios is available if I add it.
            // Actually, I'll use the existing axios pattern from FriendsPage or similar.

            // Let's use fetch for simplicity or axios if I import it.
            // I will add imports in another tool call to be safe.

            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: editName })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                updateUser(updatedUser);
                setIsEditing(false);
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-primary/10 p-8 flex flex-col items-center justify-center border-b border-gray-100 relative">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-primary shadow-sm mb-4">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    {isEditing ? (
                        <div className="flex items-center gap-2 mb-1">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {user.name}
                            <button
                                onClick={handleEditClick}
                                className="text-gray-400 hover:text-primary transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                        </h2>
                    )}

                    <p className="text-gray-500">{user.email}</p>

                    {isEditing && (
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-sm">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Full Name</p>
                            <p className="text-gray-900 font-medium">{user.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-sm">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                            <p className="text-gray-900 font-medium">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-sm">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Member Since</p>
                            <p className="text-gray-900 font-medium">{format(new Date(), 'MMMM yyyy')}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="w-full flex md:hidden items-center justify-center space-x-2 p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors mt-8"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
