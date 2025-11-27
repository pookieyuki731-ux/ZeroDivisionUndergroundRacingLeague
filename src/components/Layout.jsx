import React from 'react';
import { Trophy, Users, Settings as SettingsIcon, Flag, LogOut, Info as InfoIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, activeTab, setActiveTab }) => {
    const { isAdmin, logout } = useAuth();

    const allTabs = [
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, access: ['viewer', 'admin'] },
        { id: 'races', label: 'Race Control', icon: Flag, access: ['viewer', 'admin'] },
        { id: 'info', label: 'Info', icon: InfoIcon, access: ['viewer', 'admin'] },
        { id: 'roster', label: 'Roster', icon: Users, access: ['admin'] },
        { id: 'settings', label: 'Settings', icon: SettingsIcon, access: ['admin'] },
    ];

    // Filter tabs based on access level
    const tabs = allTabs.filter(tab =>
        isAdmin ? true : tab.access.includes('viewer')
    );

    return (
        <div className="min-h-screen bg-black text-white font-inter selection:bg-neon-red selection:text-white">
            <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setActiveTab('leaderboard')}
                                className="text-2xl font-rajdhani font-bold text-neon-red tracking-wider hover:text-red-400 transition-colors cursor-pointer"
                            >
                                ZDURL
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex space-x-4">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === tab.id
                                                ? 'bg-neon-red text-white'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4 mr-2" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
