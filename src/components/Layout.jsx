import React from 'react';
import { Trophy, Users, Settings as SettingsIcon, Flag, LogOut, Info as InfoIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import DigitalBackground from './DigitalBackground';
import logoIcon from '../assets/logo-icon.png';

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
        <div className="min-h-screen bg-black text-white font-inter selection:bg-neon-blue selection:text-white relative">
            <DigitalBackground color="#5ce1e6" />

            <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <img src={logoIcon} alt="ZDURL Logo" className="w-10 h-10 mr-3 object-contain" />
                            <button
                                onClick={() => setActiveTab('leaderboard')}
                                className="text-2xl font-rajdhani font-bold text-neon-blue tracking-wider hover:text-blue-400 transition-colors cursor-pointer"
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
                                                ? 'bg-cyan-600 text-white'
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 bg-black min-h-[calc(100vh-4rem)]">
                {children}
            </main>
        </div>
    );
};

export default Layout;
