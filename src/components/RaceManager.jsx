import React, { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { useAuth } from '../context/AuthContext';
import { Save } from 'lucide-react';

const RaceManager = () => {
    const { racers, updateRaceResult } = useLeague();
    const { isAdmin } = useAuth();
    const [selectedRaceId, setSelectedRaceId] = useState('race_1');
    const [raceResults, setRaceResults] = useState({}); // { position: racerId }

    // Generate race options (5 races)
    const races = Array.from({ length: 5 }, (_, i) => ({
        id: `race_${i + 1}`,
        name: `Race ${i + 1}`
    }));

    // Load existing results for selected race
    React.useEffect(() => {
        const results = {};
        racers.forEach(r => {
            const pos = r.raceResults?.[selectedRaceId];
            if (pos) {
                results[pos] = r.id;
            }
        });
        setRaceResults(results);
    }, [selectedRaceId, racers]);

    const handleRacerSelect = (position, racerId) => {
        setRaceResults(prev => ({
            ...prev,
            [position]: racerId
        }));
    };

    const handleSave = () => {
        // Convert { position: racerId } to { racerId: position }
        const resultsToSave = {};
        Object.entries(raceResults).forEach(([pos, rid]) => {
            if (rid) resultsToSave[rid] = parseInt(pos);
        });

        const fullResults = {};
        racers.forEach(r => {
            fullResults[r.id] = 0; // Default to 0 (no points)
        });
        Object.entries(resultsToSave).forEach(([rid, pos]) => {
            fullResults[rid] = pos;
        });

        updateRaceResult(selectedRaceId, fullResults);
        alert('Race results updated!');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-rajdhani font-bold text-white border-l-4 border-neon-red pl-4">
                    RACE CONTROL
                </h2>
                <div className="flex space-x-4 items-center">
                    <select
                        value={selectedRaceId}
                        onChange={(e) => setSelectedRaceId(e.target.value)}
                        className="bg-gray-900 text-white border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-neon-red"
                    >
                        {races.map(race => (
                            <option key={race.id} value={race.id}>{race.name}</option>
                        ))}
                    </select>
                    {isAdmin && (
                        <button
                            onClick={handleSave}
                            className="flex items-center bg-neon-red hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition-colors"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Results
                        </button>
                    )}
                    {!isAdmin && (
                        <div className="text-gray-400 text-sm italic">
                            View Only - Admin access required to edit
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(position => (
                        <div key={position} className="flex items-center space-x-4 p-4 bg-black/40 rounded border border-gray-800">
                            <div className={`w-10 h-10 flex items-center justify-center rounded font-bold text-lg ${position === 1 ? 'bg-yellow-500 text-black' :
                                position === 2 ? 'bg-gray-400 text-black' :
                                    position === 3 ? 'bg-orange-700 text-white' :
                                        'bg-gray-800 text-gray-400'
                                }`}>
                                {position}
                            </div>
                            <div className="flex-1">
                                <select
                                    value={raceResults[position] || ''}
                                    onChange={(e) => handleRacerSelect(position, e.target.value)}
                                    disabled={!isAdmin}
                                    className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-neon-red disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">-- Select Racer --</option>
                                    {racers
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(racer => (
                                            <option key={racer.id} value={racer.id}>
                                                {racer.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RaceManager;
