import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Users, Home, UserPlus } from 'lucide-react';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-primary">BillBuddy</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Home size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/groups" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Users size={20} />
                        <span className="font-medium">Groups</span>
                    </Link>
                    <Link to="/friends" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <UserPlus size={20} />
                        <span className="font-medium">Friends</span>
                    </Link>
                    <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <User size={20} />
                        <span className="font-medium">Profile</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-4 px-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Bottom Navigation for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-50 safe-area-bottom">
                <Link to="/dashboard" className="flex flex-col items-center text-gray-600 hover:text-primary">
                    <Home size={24} />
                    <span className="text-xs mt-1">Home</span>
                </Link>
                <Link to="/groups" className="flex flex-col items-center text-gray-600 hover:text-primary">
                    <Users size={24} />
                    <span className="text-xs mt-1">Groups</span>
                </Link>
                <Link to="/friends" className="flex flex-col items-center text-gray-600 hover:text-primary">
                    <UserPlus size={24} />
                    <span className="text-xs mt-1">Friends</span>
                </Link>
                <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-primary">
                    <User size={24} />
                    <span className="text-xs mt-1">Profile</span>
                </Link>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-auto md:ml-64 mb-16 md:mb-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
