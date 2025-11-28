import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { supabase } from '../utils/supabase';

const Settings = () => {
    const { settings, setSettings, isAdmin, verifyAdmin, logoutAdmin } = useLeague();
    const [accessCode, setAccessCode] = React.useState('');
    const [localPrizePool, setLocalPrizePool] = React.useState('');
    const [debugInfo, setDebugInfo] = React.useState(null);

    // Initialize local state when settings are loaded
    React.useEffect(() => {
        if (settings?.totalPrizePool) {
            setLocalPrizePool(settings.totalPrizePool);
        }
    }, [settings]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (verifyAdmin(accessCode)) {
            setAccessCode('');
        }
    };

    const handleUpdatePrizePool = () => {
        const newPrizePool = Number(localPrizePool);
        setSettings(prevSettings => ({
            ...prevSettings,
            totalPrizePool: newPrizePool
        }));
    };

    const runDebug = async () => {
        try {
            setDebugInfo('Fetching via fetchSettings()...');
            const result = await import('../utils/supabase').then(m => m.fetchSettings());
            setDebugInfo('Result: ' + JSON.stringify(result, null, 2));
        } catch (e) {
            setDebugInfo('Error: ' + e.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-rajdhani font-bold mb-8 text-white border-l-4 border-neon-blue pl-4">
                LEAGUE SETTINGS
            </h2>

            {/* Debug Section */}
            <div className="mb-8 p-4 bg-gray-900 rounded border border-red-500">
                <h3 className="text-red-500 font-bold mb-2">Debug Info</h3>
                <button
                    onClick={runDebug}
                    className="bg-red-600 text-white px-4 py-2 rounded mb-2"
                >
                    Test Fetch
                </button>
                <pre className="text-xs text-white overflow-auto max-h-40">
                    {debugInfo || 'Click Test Fetch to see raw Supabase data'}
                </pre>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-2xl space-y-6">
                {/* Admin Access Section */}
                <div className="border-b border-gray-800 pb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Admin Access</h3>
                    {!isAdmin ? (
                        <form onSubmit={handleLogin} className="flex gap-4">
                            <input
                                type="password"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                placeholder="Enter Access Code"
                                className="flex-1 bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue font-rajdhani"
                            />
                            <button
                                type="submit"
                                className="bg-neon-blue text-black font-bold px-6 py-2 rounded hover:bg-blue-400 transition-colors font-rajdhani"
                            >
                                LOGIN
                            </button>
                        </form>
                    ) : (
                        <div className="flex items-center justify-between bg-green-900/20 border border-green-500/30 rounded p-4">
                            <div className="flex items-center gap-2 text-green-400">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="font-rajdhani font-bold">ADMIN ACCESS GRANTED</span>
                            </div>
                            <button
                                onClick={logoutAdmin}
                                className="text-gray-400 hover:text-white text-sm underline"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Total Prize Pool ($)
                    </label>
                    {isAdmin ? (
                        <div className="space-y-3">
                            <input
                                type="number"
                                value={localPrizePool}
                                onChange={(e) => setLocalPrizePool(e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue font-rajdhani text-xl"
                            />
                            <button
                                onClick={handleUpdatePrizePool}
                                className="w-full bg-neon-blue text-black font-bold py-2 rounded hover:bg-blue-400 transition-colors font-rajdhani uppercase tracking-wider"
                            >
                                Update Prize Pool
                            </button>
                        </div>
                    ) : (
                        <div className="w-full bg-black/30 border border-gray-800 rounded px-4 py-2 text-gray-300 font-rajdhani text-xl cursor-not-allowed">
                            ${settings.totalPrizePool?.toLocaleString()}
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                        {isAdmin
                            ? "Click update to save changes for all users."
                            : "Only admins can modify the prize pool."}
                    </p>
                </div>

                <div className="pt-6 border-t border-gray-800">
                    <h3 className="text-lg font-bold text-white mb-4">Data Management</h3>
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                                localStorage.removeItem('zdurl_settings');
                                localStorage.removeItem('zdurl_racers');
                                localStorage.removeItem('zdurl_admin');
                                window.location.reload();
                            }
                        }}
                        className="text-red-500 hover:text-red-400 text-sm font-medium"
                    >
                        Reset All Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
