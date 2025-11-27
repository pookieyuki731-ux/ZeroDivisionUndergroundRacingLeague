import React from 'react';
import { Info as InfoIcon, Trophy, DollarSign, Car, Calendar } from 'lucide-react';

const Info = () => {
    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-rajdhani font-bold text-white mb-2">
                    LEAGUE INFORMATION
                </h1>
                <p className="text-gray-400">
                    Everything you need to know about ZDURL
                </p>
            </div>

            {/* Tournament Structure */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <Calendar className="w-6 h-6 text-neon-red mr-3" />
                    <h2 className="text-2xl font-rajdhani font-bold text-white">Tournament Structure</h2>
                </div>
                <div className="space-y-3 text-gray-300">
                    <p>
                        The Zero Division Underground Racing League operates on a <span className="text-white font-bold">seasonal format</span>, with each season consisting of <span className="text-neon-red font-bold">5 races</span>.
                    </p>
                    <p>
                        Racers accumulate points throughout the season, with the final standings determining prize distribution at the end of each season.
                    </p>
                    <p className="text-sm text-gray-400 italic">
                        All races are held in secure, undisclosed locations to ensure maximum safety and discretion.
                    </p>
                </div>
            </div>

            {/* Points System */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <Trophy className="w-6 h-6 text-neon-red mr-3" />
                    <h2 className="text-2xl font-rajdhani font-bold text-white">Points System</h2>
                </div>
                <p className="text-gray-300 mb-4">
                    Points are awarded based on finishing position in each race:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                        { pos: '1st', pts: 22, highlight: true },
                        { pos: '2nd', pts: 18, highlight: true },
                        { pos: '3rd', pts: 15, highlight: true },
                        { pos: '4th', pts: 12 },
                        { pos: '5th', pts: 10 },
                        { pos: '6th', pts: 8 },
                        { pos: '7th', pts: 6 },
                        { pos: '8th', pts: 4 },
                        { pos: '9th', pts: 2 },
                        { pos: '10th', pts: 1 },
                    ].map((item) => (
                        <div
                            key={item.pos}
                            className={`p-3 rounded text-center ${item.highlight
                                ? 'bg-neon-red/10 border border-neon-red/30'
                                : 'bg-gray-800/50 border border-gray-700'
                                }`}
                        >
                            <div className="text-sm text-gray-400">{item.pos}</div>
                            <div className={`text-xl font-bold ${item.highlight ? 'text-neon-red' : 'text-white'}`}>
                                {item.pts} pts
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-sm text-gray-400 mt-4">
                    * Positions below 10th receive no points
                </p>
            </div>

            {/* Prize Distribution */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <DollarSign className="w-6 h-6 text-neon-red mr-3" />
                    <h2 className="text-2xl font-rajdhani font-bold text-white">Prize Distribution</h2>
                </div>
                <p className="text-gray-300 mb-4">
                    At the end of each season, the total prize pool is distributed among the top finishers based on their final standings:
                </p>
                <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-900/20 to-transparent border-l-4 border-yellow-500">
                        <span className="text-white font-bold">🥇 1st Place</span>
                        <span className="text-yellow-500 font-bold">40% of Prize Pool</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-400/20 to-transparent border-l-4 border-gray-400">
                        <span className="text-white font-bold">🥈 2nd Place</span>
                        <span className="text-gray-300 font-bold">25% of Prize Pool</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-900/20 to-transparent border-l-4 border-orange-600">
                        <span className="text-white font-bold">🥉 3rd Place</span>
                        <span className="text-orange-400 font-bold">15% of Prize Pool</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 border-l-4 border-gray-600">
                        <span className="text-gray-300">4th Place</span>
                        <span className="text-gray-400">10% of Prize Pool</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 border-l-4 border-gray-600">
                        <span className="text-gray-300">5th Place</span>
                        <span className="text-gray-400">6% of Prize Pool</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 border-l-4 border-gray-600">
                        <span className="text-gray-300">6th Place</span>
                        <span className="text-gray-400">4% of Prize Pool</span>
                    </div>
                </div>
                <p className="text-sm text-gray-400 mt-4 italic">
                    * Prize pool amount is set by league administrators and may vary by season
                </p>
            </div>

            {/* Vehicle Requirements */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                    <Car className="w-6 h-6 text-neon-red mr-3" />
                    <h2 className="text-2xl font-rajdhani font-bold text-white">Vehicle Requirements</h2>
                </div>
                <div className="bg-neon-red/10 border border-neon-red/30 rounded p-4 mb-4">
                    <p className="text-white font-bold text-lg mb-2">
                        ⚠️ A-CLASS VEHICLES ONLY
                    </p>
                    <p className="text-gray-300">
                        This league is restricted to <span className="text-neon-red font-bold">A-Class vehicles</span> only. Any vehicle not meeting A-Class specifications will be disqualified from competition.
                    </p>
                </div>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
                    <p className="text-yellow-200 font-bold mb-2">
                        💡 Recommended: Fake Plates
                    </p>
                    <p className="text-gray-300">
                        While not mandatory, it is <span className="text-yellow-200 font-bold">highly recommended</span> to use fake license plates during races for added discretion and to avoid potential complications.
                    </p>
                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
                <InfoIcon className="w-12 h-12 text-neon-red mx-auto mb-4" />
                <h2 className="text-2xl font-rajdhani font-bold text-white mb-2">
                    Questions?
                </h2>
                <p className="text-gray-300">
                    Contact the league administrator for more information or to report any issues.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    Remember: What happens in ZDURL, stays in ZDURL.
                </p>
            </div>
        </div>
    );
};

export default Info;
