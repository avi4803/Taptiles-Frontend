import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import GlassInput from '../components/common/GlassInput';
import GlassButton from '../components/common/GlassButton';


const WelcomePage = ({ onStart }) => {
    const [username, setUsername] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');

    const { connect, isConnected, connectionError, userData, onlineUsers } = useSocket();

    // Handle successful connection
    useEffect(() => {
        if (isConnected && userData) {
            console.log('✅ Connected successfully:', userData);
            // Navigate to game page
            onStart(userData.username);
        }
    }, [isConnected, userData, onStart]);

    // Handle connection errors
    useEffect(() => {
        if (connectionError) {
            setError(connectionError);
            setIsConnecting(false);
        }
    }, [connectionError]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous errors
        setError('');

        // Validate username
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        if (username.trim().length < 2) {
            setError('Username must be at least 2 characters');
            return;
        }

        if (username.trim().length > 20) {
            setError('Username must be less than 20 characters');
            return;
        }

        // Connect to backend
        setIsConnecting(true);
        connect(username.trim());
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white h-screen w-full overflow-hidden flex flex-col items-center justify-center relative selection:bg-primary selection:text-white">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Mesh Gradient */}
                <div className="absolute inset-0 opacity-40 dark:opacity-30 bg-[radial-gradient(circle_at_50%_-20%,#5b5df1_0%,transparent_50%)]"></div>
                <div className="absolute inset-0 opacity-20 dark:opacity-20 bg-[radial-gradient(circle_at_0%_50%,#8b5cf6_0%,transparent_40%)]"></div>
                <div className="absolute inset-0 opacity-20 dark:opacity-20 bg-[radial-gradient(circle_at_100%_80%,#3b82f6_0%,transparent_40%)]"></div>

                {/* Floating Tiles (Decorative) */}
                <div className="absolute top-20 left-[10%] w-24 h-24 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-white/10 rotate-12 animate-float-slow backdrop-blur-sm"></div>
                <div className="absolute bottom-32 right-[15%] w-32 h-32 rounded-xl bg-gradient-to-tl from-purple-500/20 to-transparent border border-white/10 -rotate-6 animate-float-medium backdrop-blur-sm"></div>
                <div className="absolute top-40 right-[20%] w-16 h-16 rounded-lg bg-gradient-to-b from-blue-500/20 to-transparent border border-white/10 rotate-45 animate-float-fast backdrop-blur-sm"></div>
                <div className="absolute bottom-20 left-[20%] w-12 h-12 rounded-lg bg-white/5 border border-white/5 rotate-12 animate-float-slow backdrop-blur-sm"></div>
            </div>

            {/* Main Content Container */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 w-full">

                {/* Header / Logo Area */}
                <div className="text-center mb-12 transform hover:scale-105 transition-transform duration-500 cursor-default">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-2 drop-shadow-2xl select-none">
                        TapTile
                    </h1>
                    <p className="text-lg md:text-xl font-bold tracking-[0.2em] text-primary uppercase drop-shadow-[0_0_15px_rgba(91,93,241,0.5)] select-none">
                        Claim. Compete. Conquer.
                    </p>
                </div>

                {/* Login / Entry Form */}
                <div className="w-full max-w-md mx-auto">
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <GlassInput
                            icon="person_outline"
                            placeholder="enter_gamertag_"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isConnecting}
                        />

                        {/* Error Message */}
                        {error && (
                            <div className="glass-panel px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10">
                                <p className="text-red-400 text-sm font-medium text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        <GlassButton
                            type="submit"
                            icon={isConnecting ? "hourglass_empty" : "arrow_forward"}
                            onClick={handleSubmit}
                            disabled={isConnecting}
                        >
                            {isConnecting ? 'Connecting...' : 'Start Playing'}
                        </GlassButton>
                    </form>
                </div>

                {/* Footer / Status Badge */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
                    <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 shadow-lg backdrop-blur-md">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-300 tracking-wide">
                            <span className="text-white font-bold">{onlineUsers || 0}</span> players online
                        </span>
                    </div>
                </div>

                {/* Abstract User Avatars (Social Proof) */}
                <div className="absolute top-8 right-8 hidden md:flex items-center gap-[-0.5rem]">
                    <div className="flex -space-x-3 overflow-hidden p-2 glass-panel rounded-full">
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#101122]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4qKN-_W9PPHh1fneKWO7YAh1MhRgY0YcLUzEUBVeWz8E1RQu50U09szAAECRppiD0Yj9-45cmky0jqI6q8wkf6nRh5FzC8Etz_5WB-X0S6NaO-1t-LUYhxsV269zomevZnxuuvWuItXxfZHg3-8pXYdyKJTKZu7pYVtTvtddK7_2NIQkknQlk0zAyhmJA2x9bmuwNYTwMX-481BlCnxCI41kht2FWVg6feMWQO5gD3nA0m2iwDKgfp9ZXVJV18oj885ti3l2XZy0" alt="User Avatar" />
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#101122]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa6vFZlVTvbDOmmcKS3viaJWmklKrKjIRIHcfJW20JhC6mdAkabmMRvgxDvj9LTuUkmJTOAmGTMuOo59fVQel9EXOU8ooTnqfh1Bgv38FADYV-o7N99Ij35udO-crFkO8ARRkDPpwJ-K68dpb01zdElvq9eRBmUqRwU9xO_xDSeihjGWZLmspFtjjGjI7pWFxH09qn9uttcScAUd-tN0FDJoFy-MLc4hMWFc8ToY6vye7poWKUe_H514yKOQELNZQIxAQdvNc9zZE" alt="User Avatar" />
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#101122]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Rg22ZCQba-8sRbqVwN9bjrobOdWJfRvBrdX-iI-Vry-ExUlEIwM-UmyEzyHhR2qgglYssJL5Ty13hMWjkxfFIYwYKIOas5sDLSU5r93xF4jxbeRltxMvCglgDw6Lt05jfbV_mvGn0aO-KHehotMpF0MlCFmlF9eCbTRqOhsg3vkFKDU56OVKJI317lIlT9IVFK7PO7q-EpU9g32h0tG8ludogmDujDJzkg8ndxOTMTi5k7wZ0t53HiyQL1LcUTvk6k0h_6xmqyI" alt="User Avatar" />
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary ring-2 ring-[#101122] text-xs font-bold text-white z-10">
                            +99
                        </div>
                    </div>
                    <span className="ml-3 text-xs font-medium text-gray-400">Join the chaos</span>
                </div>
            </main>
        </div>
    );
};

export default WelcomePage;
