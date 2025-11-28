import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';
import DigitalBackground from './DigitalBackground';
import starIcon from '../assets/star-icon.png'

const LoginPage = () => {
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [bgColor, setBgColor] = useState('#ff1744') // Red
    const [isFlashing, setIsFlashing] = useState(false) // Track flash state
    const { login } = useAuth()

    const handleSubmit = (e) => {
        e.preventDefault()
        const success = login(code)
        if (!success) {
            setError('Invalid access code. Please try again.')
            setCode('')

            // Flash effect: Everything turns yellow for 0.3 seconds
            setIsFlashing(true)
            setBgColor('#ffeb3b') // Yellow background
            setTimeout(() => {
                setIsFlashing(false)
                setBgColor('#ff1744') // Back to Red
            }, 300) // Flash duration: 300ms
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden" style={{ position: 'relative' }}>
            <DigitalBackground color={bgColor} />

            <div className="max-w-md w-full flex flex-col items-center" style={{ position: 'relative', zIndex: 10 }}>
                {/* Title Section - Centered, Big, Bold, White */}
                <div className="text-center mb-10">
                    <img src={starIcon} alt="ZDURL Star" className="w-32 h-32 mx-auto mb-4 object-contain" />
                    <p className="text-xl font-bold text-white uppercase tracking-[0.2em] leading-relaxed" style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
                        Zero Division<br />
                        Underground Racing League
                    </p>
                </div>

                {/* Login Box */}
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-8 border border-gray-800 shadow-2xl w-full">
                    <div className="flex justify-center mb-6">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${isFlashing ? 'bg-yellow-400/10' : 'bg-neon-red/10'}`}>
                            <Lock className={`w-8 h-8 transition-all duration-200 ${isFlashing ? 'text-yellow-400' : 'text-neon-red'}`} />
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
                            <div className={`rounded p-3 text-sm text-center transition-all duration-200 ${isFlashing ? 'bg-yellow-400/10 border border-yellow-400/50 text-yellow-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full font-bold py-3 rounded transition-all duration-200 uppercase tracking-wider ${isFlashing ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-neon-red hover:bg-red-700'} text-white`}
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
