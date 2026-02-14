import React, { useState, useEffect } from 'react';

const LoadingPage = ({ onComplete }) => {
    // State for progress and message
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Connecting tiles...');

    // Real connection check logic
    useEffect(() => {
        let isMounted = true;
        let pinger;

        // Visual progress ticker - moves slowly to 90% while waiting
        const progressTicker = setInterval(() => {
            setProgress(prev => {
                const target = 90;
                if (prev >= target) return prev;
                // Logarithmic slowdown
                const remaining = target - prev;
                return prev + (remaining * 0.05);
            });
        }, 100);

        const checkConnection = async () => {
            try {
                const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
                console.log('Testing connection to:', socketUrl);

                // Create a timeout for the fetch
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 7000);

                // Ping the server (using HEAD to save bandwidth, no-cors to avoid opaque response issues crashing fetch in some envs, though we just need success)
                // Use no-cors keps it simple, we just want to know if it connects.
                await fetch(socketUrl, {
                    method: 'GET', // GET is safer than HEAD for some servers/proxies
                    signal: controller.signal,
                    mode: 'no-cors'
                });

                clearTimeout(timeoutId);

                if (isMounted) {
                    clearInterval(progressTicker);
                    setProgress(100);
                    setMessage('Ready!');
                    if (onComplete) setTimeout(onComplete, 500);
                }
            } catch (err) {
                console.warn('Connection check failed:', err);
                if (isMounted) {
                    setMessage('Waking up server...');
                    // Retry after delay
                    pinger = setTimeout(checkConnection, 2000);
                }
            }
        };

        checkConnection();

        return () => {
            isMounted = false;
            clearInterval(progressTicker);
            if (pinger) clearTimeout(pinger);
        };
    }, [onComplete]);

    // Message rotation based on progress milestones
    useEffect(() => {
        if (progress < 30) setMessage('Initializing...');
        else if (progress < 60) setMessage('Connecting to server...');
        else if (progress < 90) setMessage('Waking up hamsters...');
        else if (progress >= 100) setMessage('Connected!');
    }, [progress]);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white overflow-hidden h-screen flex flex-col relative selection:bg-primary selection:text-white">
            {/* Background Layer: Grid & Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
                {/* Central Glow */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow"></div>

                {/* Floating Tiles (Decorative Background Elements) */}
                <div className="absolute top-[15%] left-[10%] w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 animate-float backdrop-blur-sm rotate-12"></div>
                <div className="absolute bottom-[20%] right-[15%] w-24 h-24 rounded-2xl bg-[#ec4899]/10 border border-[#ec4899]/20 animate-float-delayed backdrop-blur-sm -rotate-6"></div>
                <div className="absolute top-[30%] right-[25%] w-12 h-12 rounded-lg bg-white/5 border border-white/10 animate-float backdrop-blur-sm rotate-45 opacity-50"></div>
                <div className="absolute bottom-[10%] left-[20%] w-20 h-20 rounded-xl bg-primary/5 border border-primary/10 animate-float backdrop-blur-sm rotate-3 opacity-60"></div>
            </div>

            {/* Main Content Container */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6">

                {/* Logo Section */}
                <div className="text-center mb-16 relative">
                    <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-gradient animate-gradient-x select-none drop-shadow-2xl">
                        TapTile
                    </h1>
                    <div className="absolute -bottom-4 right-0 transform translate-x-4 rotate-3">
                        <span className="bg-white text-background-dark text-xs font-bold px-2 py-1 rounded shadow-lg uppercase tracking-widest">Beta</span>
                    </div>
                </div>

                {/* Loading Interface */}
                <div className="w-full max-w-2xl mx-auto">
                    {/* Percentage & Status Row */}
                    <div className="flex justify-between items-end mb-4 px-2">
                        <span className="text-lg md:text-xl text-gray-300 font-medium tracking-wide">
                            {message}
                        </span>
                        <span className="text-5xl md:text-6xl font-bold text-white font-mono tabular-nums leading-none tracking-tight">
                            {Math.floor(progress)}%
                        </span>
                    </div>

                    {/* Glassmorphic Progress Bar Container */}
                    <div className="glass-panel p-1.5 rounded-full shadow-2xl relative overflow-hidden group">
                        {/* Inner Progress Fill */}
                        <div
                            className="h-6 md:h-8 rounded-full progress-shimmer animate-gradient-x relative shadow-[0_0_20px_rgba(91,93,241,0.6)] transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        >
                            {/* Subtle highlight on top of bar */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full"></div>
                            {/* Trailing particles effect (Simulated with absolute div at right edge) */}
                            <div className="absolute right-0 top-0 h-full w-4 bg-white/50 blur-[4px]"></div>
                        </div>
                    </div>

                    {/* Loading Steps / Micro-text */}
                    <div className="mt-6 flex justify-between items-center text-sm text-gray-500 font-mono">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span>Loading Assets (142/190)</span>
                        </div>
                        <div className="opacity-50">
                            ID: 8X-9921
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full py-8 text-center">
                <p className="text-gray-600 text-xs font-mono tracking-widest uppercase">
                    v1.0.4 beta • competitive tile-claiming engine
                </p>
            </footer>
        </div>
    );
};

export default LoadingPage;
