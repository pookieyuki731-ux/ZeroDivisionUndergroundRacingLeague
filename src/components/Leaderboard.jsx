import React from 'react';
import { motion } from 'framer-motion';
import { useLeague } from '../context/LeagueContext';
import { calculatePrize } from '../utils/prizeCalculator';

const Leaderboard = () => {
    const { racers, settings } = useLeague();

    const sortedRacers = [...racers].sort((a, b) => b.points - a.points);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Leaderboard */}
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-rajdhani font-bold mb-6 text-white border-l-4 border-neon-blue pl-4">
                        SEASON 1 RANKINGS
                    </h2>
                    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-deep-blue text-white uppercase font-rajdhani tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Pos</th>
                                    <th className="px-6 py-4">Racer</th>
                                    <th className="px-6 py-4">Vehicle</th>
                                    <th className="px-6 py-4 text-right">Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {sortedRacers.map((racer, index) => (
                                    <motion.tr
                                        key={racer.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-bold text-lg text-gray-400">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">
                                            {racer.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 italic">
                                            {racer.vehicle || 'Unknown Vehicle'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-neon-blue text-xl">
                                            {racer.points}
                                        </td>
                                    </motion.tr>
                                ))}
                                {sortedRacers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No racers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Prize Pool */}
                <div>
                    <h2 className="text-3xl font-rajdhani font-bold mb-6 text-white border-l-4 border-neon-blue pl-4">
                        PRIZE POOL
                    </h2>
                    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 shadow-2xl">
                        <div className="text-center mb-8">
                            <p className="text-gray-400 uppercase text-sm tracking-widest">Total Prize Pool</p>
                            <p className="text-4xl font-bold text-neon-blue font-rajdhani">
                                ${settings.totalPrizePool.toLocaleString()}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {sortedRacers.slice(0, 10).map((racer, index) => {
                                const prize = calculatePrize(settings.totalPrizePool, index + 1);
                                return (
                                    <div key={racer.id} className="flex justify-between items-center p-3 bg-black/40 rounded border border-gray-800">
                                        <div className="flex items-center">
                                            <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold mr-3 ${index === 0 ? 'bg-yellow-500 text-black' :
                                                index === 1 ? 'bg-gray-400 text-black' :
                                                    index === 2 ? 'bg-orange-700 text-white' :
                                                        'bg-gray-800 text-gray-400'
                                                }`}>
                                                {index + 1}
                                            </span>
                                            <span className="text-sm font-medium">{racer.name}</span>
                                        </div>
                                        <span className="text-neon-blue font-bold font-rajdhani">
                                            ${prize.toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
