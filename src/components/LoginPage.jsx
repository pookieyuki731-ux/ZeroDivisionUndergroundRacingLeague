import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

const LoginPage = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = login(code);
        if (!success) {
            setError('Invalid access code. Please try again.');
            setCode('');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-rajdhani font-bold text-neon-red tracking-wider mb-2">
                        ZDURL
                    </h1>
                    <p className="text-gray-400 text-sm uppercase tracking-widest">
                        Zero Division Underground Racing League
                    </p>
                </div>

                <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-neon-red/10 rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-neon-red" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-rajdhani font-bold text-white text-center mb-6">
                        ACCESS REQUIRED
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Enter Access Code
                            </label>
                            <input
                                type="password"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    setError('');
                                }}
                                placeholder="••••••••"
                                className="w-full bg-black/50 border border-gray-700 rounded px-4 py-3 text-white text-center text-lg tracking-widest focus:outline-none focus:border-neon-red transition-colors"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded p-3 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-neon-red hover:bg-red-700 text-white font-bold py-3 rounded transition-colors uppercase tracking-wider"
                        >
                            Enter
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <p className="text-xs text-gray-500 text-center">
                            Contact the league administrator for access codes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
