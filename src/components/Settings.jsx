import React, { useRef } from 'react';
import { useLeague } from '../context/LeagueContext';
import { supabase } from '../utils/supabase';

const Settings = () => {
    const { settings, setSettings, isAdmin, verifyAdmin, logoutAdmin } = useLeague();
    const [accessCode, setAccessCode] = React.useState('');
    const [localPrizePool, setLocalPrizePool] = React.useState('');
    const [localRaceNames, setLocalRaceNames] = React.useState({});
    const raceNameTimeoutRef = useRef({});

    // Initialize local state when settings are loaded
    React.useEffect(() => {
        if (settings?.totalPrizePool) {
            setLocalPrizePool(settings.totalPrizePool);
        }
        if (settings?.raceNames) {
            setLocalRaceNames(settings.raceNames);
        }
    }, [settings]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (verifyAdmin(accessCode)) {
            setAccessCode('');
        }
    };

    const handleUpdatePrizePool = async () => {
        const newPrizePool = Number(localPrizePool);

        // Optimistic update
        setSettings(prevSettings => ({
            ...prevSettings,
            totalPrizePool: newPrizePool
        }));

        try {
            const { updateSettings } = await import('../utils/supabase');
            await updateSettings({ ...settings, totalPrizePool: newPrizePool });
        } catch (error) {
            console.error('Failed to update settings:', error);
        }
    };

    const handleRaceNameChange = (raceId, newName) => {
        const updatedNames = {
            ...localRaceNames,
            [raceId]: newName
        };
        setLocalRaceNames(updatedNames);

        // Clear existing timeout for this race
        if (raceNameTimeoutRef.current[raceId]) {
            clearTimeout(raceNameTimeoutRef.current[raceId]);
        }

        // Set new timeout for auto-save (500ms debounce)
        raceNameTimeoutRef.current[raceId] = setTimeout(async () => {
            // Optimistic update
            setSettings(prevSettings => ({
                ...prevSettings,
                raceNames: updatedNames
            }));

            try {
                const { updateSettings } = await import('../utils/supabase');
                await updateSettings({ ...settings, raceNames: updatedNames });
            } catch (error) {
                console.error('Failed to update race names:', error);
            }
        }, 500);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-rajdhani font-bold mb-8 text-white border-l-4 border-neon-blue pl-4">
                LEAGUE SETTINGS
            </h2>

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

                {/* Prize Pool Section */}
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

                {/* Race Names Section */}
                <div className="pt-6 border-t border-gray-800">
                    <h3 className="text-lg font-bold text-white mb-4">Race Names</h3>
                    {isAdmin ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }, (_, i) => {
                                const raceId = `race_${i + 1}`;
                                return (
                                    <div key={raceId}>
                                        <label className="block text-sm text-gray-400 mb-1">
                                            Race {i + 1}
                                        </label>
                                        <input
                                            type="text"
                                            value={localRaceNames[raceId] || ''}
                                            onChange={(e) => handleRaceNameChange(raceId, e.target.value)}
                                            placeholder={`Race ${i + 1}`}
                                            className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-500 font-rajdhani hover:border-cyan-500/50 transition-colors"
                                        />
                                    </div>
                                );
                            })}
                            <p className="text-xs text-cyan-400 mt-2 flex items-center">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-2"></span>
                                Auto-save enabled - changes sync in real-time
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {Array.from({ length: 5 }, (_, i) => {
                                const raceId = `race_${i + 1}`;
                                return (
                                    <div key={raceId} className="flex items-center justify-between bg-black/30 border border-gray-800 rounded px-4 py-2">
                                        <span className="text-gray-500 text-sm">Race {i + 1}:</span>
                                        <span className="text-white font-rajdhani">{settings.raceNames?.[raceId] || `Race ${i + 1}`}</span>
                                    </div>
                                );
                            })}
                            <p className="text-xs text-gray-500 mt-2">
                                Only admins can modify race names.
                            </p>
                        </div>
                    )}
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
