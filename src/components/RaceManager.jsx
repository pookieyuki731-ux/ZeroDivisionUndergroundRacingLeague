import React, { useState, useEffect, useRef } from 'react';
import { useLeague } from '../context/LeagueContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Award, ChevronDown } from 'lucide-react';

const RaceManager = () => {
    const { racers, updateRaceResult, settings } = useLeague();
    const { isAdmin } = useAuth();
    const [selectedRaceId, setSelectedRaceId] = useState('race_1');
    const [raceResults, setRaceResults] = useState({}); // { position: racerId }
    const saveTimeoutRef = useRef(null);

    // Get race names from settings
    const raceNames = settings?.raceNames || {
        race_1: 'Race 1',
        race_2: 'Race 2',
        race_3: 'Race 3',
        race_4: 'Race 4',
        race_5: 'Race 5'
    };

    // Generate race options (5 races) with custom names
    const races = Array.from({ length: 5 }, (_, i) => ({
        id: `race_${i + 1}`,
        name: raceNames[`race_${i + 1}`] || `Race ${i + 1}`
    }));

    // Load existing results for selected race
    useEffect(() => {
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
        const newResults = {
            ...raceResults,
            [position]: racerId
        };
        setRaceResults(newResults);

        // Only auto-save if admin
        if (!isAdmin) return;

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set new timeout for auto-save
        saveTimeoutRef.current = setTimeout(() => {
            // Convert { position: racerId } to { racerId: position }
            const resultsToSave = {};
            Object.entries(newResults).forEach(([pos, rid]) => {
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
        }, 500);
    };

    const getPodiumIcon = (position) => {
        if (position === 1) return <Trophy className="w-5 h-5" />;
        if (position === 2) return <Medal className="w-5 h-5" />;
        if (position === 3) return <Award className="w-5 h-5" />;
        return null;
    };

    const getPositionStyle = (position) => {
        if (position === 1) {
            return 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/50';
        }
        if (position === 2) {
            return 'bg-gradient-to-br from-gray-300 to-gray-400 text-black shadow-lg shadow-gray-400/50';
        }
        if (position === 3) {
            return 'bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-600/50';
        }
        return 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300';
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-rajdhani font-bold text-white border-l-4 border-neon-blue pl-4">
                    RACE CONTROL
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                    <div className="relative inline-block">
                        <select
                            value={selectedRaceId}
                            onChange={(e) => setSelectedRaceId(e.target.value)}
                            style={{ colorScheme: 'dark' }}
                            className="appearance-none w-auto bg-gradient-to-r from-gray-900 to-gray-800 text-white border border-cyan-500/50 rounded-lg py-3 pl-6 pr-12 focus:outline-none focus:border-cyan-500 hover:border-cyan-400 transition-all shadow-lg font-rajdhani text-lg font-bold cursor-pointer"
                        >
                            {races.map(race => (
                                <option key={race.id} value={race.id} style={{ backgroundColor: '#111827', color: '#ffffff' }}>{race.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
                    </div>
                    {!isAdmin && (
                        <div className="text-gray-400 text-sm italic bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700">
                            View Only - Admin access required to edit
                        </div>
                    )}
                    {isAdmin && (
                        <div className="text-cyan-400 text-sm flex items-center bg-cyan-900/20 px-4 py-2 rounded-lg border border-cyan-500/30">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-2"></span>
                            Auto-save enabled
                        </div>
                    )}
                </div>
            </div>

            {/* Podium Section (Top 3) */}
            <div className="mb-8">
                <h3 className="text-xl font-rajdhani font-bold text-cyan-400 mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    PODIUM
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(position => (
                        <div
                            key={position}
                            className={`${getPositionStyle(position)} rounded-xl p-6 transform hover:scale-105 transition-all duration-300`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="text-3xl font-bold">#{position}</div>
                                    {getPodiumIcon(position)}
                                </div>
                                <div className="text-right">
                                    {position === 1 && <div className="text-xs font-bold uppercase tracking-wider">Winner</div>}
                                    {position === 2 && <div className="text-xs font-bold uppercase tracking-wider">2nd Place</div>}
                                    {position === 3 && <div className="text-xs font-bold uppercase tracking-wider">3rd Place</div>}
                                    {raceResults[position] && (
                                        <div className="text-xs text-gray-400 mt-1 italic">
                                            {racers.find(r => r.id === raceResults[position])?.vehicle || 'Unknown Vehicle'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="relative inline-block w-full">
                                <select
                                    value={raceResults[position] || ''}
                                    onChange={(e) => handleRacerSelect(position, e.target.value)}
                                    disabled={!isAdmin}
                                    style={{ colorScheme: 'dark' }}
                                    className={`appearance-none w-full ${position === 1 ? 'bg-yellow-600/90 text-black placeholder-black/50' :
                                        position === 2 ? 'bg-gray-400/90 text-black placeholder-black/50' :
                                            'bg-orange-700/90 text-white placeholder-white/50'
                                        } border-0 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed font-rajdhani font-bold text-lg cursor-pointer`}
                                >
                                    <option value="" style={{ backgroundColor: '#111827', color: '#ffffff' }}>Select Racer</option>
                                    {racers
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(racer => (
                                            <option key={racer.id} value={racer.id} style={{ backgroundColor: '#111827', color: '#ffffff' }}>
                                                {racer.name}
                                            </option>
                                        ))}
                                </select>
                                <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${position === 1 || position === 2 ? 'text-black' : 'text-white'}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Remaining Positions */}
            <div>
                <h3 className="text-xl font-rajdhani font-bold text-gray-400 mb-4">
                    POSITIONS 4-10
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 7 }, (_, i) => i + 4).map(position => (
                        <div
                            key={position}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10"
                        >
                            <div className="flex items-center space-x-4 mb-3">
                                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-600 font-bold text-xl text-gray-300">
                                    {position}
                                </div>
                                <div className="flex-1 text-sm text-gray-400 font-rajdhani italic">
                                    {raceResults[position]
                                        ? racers.find(r => r.id === raceResults[position])?.vehicle || 'Unknown Vehicle'
                                        : 'No racer selected'}
                                </div>
                            </div>
                            <div className="relative inline-block w-full">
                                <select
                                    value={raceResults[position] || ''}
                                    onChange={(e) => handleRacerSelect(position, e.target.value)}
                                    disabled={!isAdmin}
                                    style={{ colorScheme: 'dark' }}
                                    className="appearance-none w-full bg-black/50 text-white border border-gray-600 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-500/50 transition-colors font-rajdhani cursor-pointer"
                                >
                                    <option value="" style={{ backgroundColor: '#111827', color: '#ffffff' }}>Select Racer</option>
                                    {racers
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(racer => (
                                            <option key={racer.id} value={racer.id} style={{ backgroundColor: '#111827', color: '#ffffff' }}>
                                                {racer.name}
                                            </option>
                                        ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RaceManager;
