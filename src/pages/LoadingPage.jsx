import React, { useState, useEffect } from 'react';

const LoadingPage = ({ onComplete }) => {
    // State for progress and message
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Connecting tiles...');

    // Mind-trick loader logic
    useEffect(() => {
        let interval;

        const updateProgress = () => {
            setProgress(prev => {
                // If complete, stop
                if (prev >= 100) {
                    clearInterval(interval);
                    if (onComplete) setTimeout(onComplete, 500);
                    return 100;
                }

                // Logic for variable speed to trick the mind
                let increment = 0;

                // Phase 1: Fast start (0-70%) - feels responsive
                if (prev < 70) {
                    increment = Math.random() * 2 + 0.5; // Random jump 0.5 - 2.5%
                }
                // Phase 2: Slow middle "stuck" feeling (70-85%) - builds anticipation
                else if (prev < 85) {
                    increment = Math.random() * 0.2; // Tiny crawl
                }
                // Phase 3: Fast finish (85-99%) - release tension
                else if (prev < 99) {
                    increment = Math.random() * 1.5 + 0.5;
                }

                // Cap at 99.9 until forced completion
                return Math.min(prev + increment, 99.9);
            });
        };

        // Run update loop every 100ms
        interval = setInterval(updateProgress, 100);

        // Force finish after 4.5 seconds (fallback to ensure it doesn't stick forever)
        const timeout = setTimeout(() => {
            setProgress(100);
            clearInterval(interval);
            if (onComplete) setTimeout(onComplete, 500);
        }, 4500);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [onComplete]);

    // Message rotation based on progress milestones
    useEffect(() => {
        if (progress < 30) setMessage('Connecting tiles...');
        else if (progress < 60) setMessage('Syncing players...');
        else if (progress < 85) setMessage('Preparing your canvas...');
        else if (progress >= 100) setMessage('Ready!');
        else setMessage('Almost there...');
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
