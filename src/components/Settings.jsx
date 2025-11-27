import React from 'react';
import { useLeague } from '../context/LeagueContext';

const Settings = () => {
    const { settings, setSettings } = useLeague();

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-rajdhani font-bold text-white border-l-4 border-neon-red pl-4 mb-8">
                LEAGUE SETTINGS
            </h2>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-2xl space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Total Prize Pool ($)
                    </label>
                    <input
                        type="number"
                        value={settings.totalPrizePool}
                        onChange={(e) => setSettings(prev => ({ ...prev, totalPrizePool: Number(e.target.value) }))}
                        className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-red font-rajdhani text-xl"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        This amount will be distributed according to the league's percentage rules.
                    </p>
                </div>

                <div className="pt-6 border-t border-gray-800">
                    <h3 className="text-lg font-bold text-white mb-4">Data Management</h3>
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                                localStorage.removeItem('zdurl_settings');
                                localStorage.removeItem('zdurl_racers');
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
