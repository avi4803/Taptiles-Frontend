import React, { useState } from 'react';
import Header from '../components/game/Header';
import GameGrid from '../components/game/GameGrid';
import Sidebar from '../components/game/Sidebar';
import GameOverModal from '../components/game/GameOverModal'; // Import Modal
import { useGameLogic } from '../hooks/useGameLogic';
import { useGame } from '../context/GameContext'; // Import context to get grid size

const GamePage = ({ username, onExit }) => {
    const { tiles, handleTileClick, formattedTime, leaderboard, gameState, onlineUsers, timeLeft } = useGameLogic(username); // Add timeLeft
    const { currentGame, leaveGameRoom } = useGame();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const handleReturnToLobby = () => {
        setShowExitConfirm(true);
    };

    const confirmExit = () => {
        leaveGameRoom();
        if (onExit) onExit();
        setShowExitConfirm(false);
    };

    // Calculate real stats
    const myStats = leaderboard.find(p => p.username === username);
    const claimed = (myStats?.pts || 0) / 10;
    const score = myStats?.pts || 0;
    const totalTiles = tiles.length || 1;
    const dominance = ((claimed / totalTiles) * 100).toFixed(1);

    // Estimate elapsed time
    const initialDuration = currentGame?.duration ? currentGame.duration / 1000 : 300;
    const elapsedMinutes = Math.max(0.1, (initialDuration - timeLeft) / 60);
    const rate = (claimed / elapsedMinutes).toFixed(1);

    const stats = {
        claimed,
        score,
        dominance,
        rate
    };

    if (!currentGame) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <h2 className="text-xl font-bold">Loading Game Arena...</h2>
                    <button
                        onClick={handleReturnToLobby}
                        className="px-4 py-2 bg-slate-200 dark:bg-white/10 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
                    >
                        Return to Lobby
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display overflow-hidden overscroll-y-contain">
            {/* Header - Fixed at top */}
            <header className="h-14 lg:h-16 flex-none bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 lg:px-6 z-30 shadow-sm relative">
                {/* Left: Actions */}
                <div className="flex items-center gap-1 md:gap-3">
                    <button
                        onClick={handleReturnToLobby}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        title="Back to Lobby"
                    >
                        <span className="material-icons-round text-slate-600 dark:text-slate-400">arrow_back</span>
                    </button>

                    <button
                        onClick={handleReturnToLobby}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Surrender"
                    >
                        <span className="material-icons-round">flag</span>
                    </button>

                    <div className="flex flex-col hidden md:flex">
                        <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent leading-none">
                            TapTile
                        </h1>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {currentGame?.gameId}
                        </span>
                    </div>
                </div>

                {/* Center: Timer/Status */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                    <div className={`text-2xl font-black font-mono leading-none ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>
                        {formattedTime}
                    </div>
                </div>

                {/* Right: Actions/Stats Toggle */}
                <div className="flex items-center gap-2">
                    {/* Mobile Toggle for Sidebar */}
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-400"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <span className="material-icons-round">
                            {isSidebarOpen ? 'close' : 'leaderboard'}
                        </span>
                    </button>
                </div>
            </header>

            {/* Main Content Area - Takes remaining height */}
            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

                {/* Left Side: Game Grid - Scrollable independently with background pattern */}
                <div className="flex-1 h-full overflow-auto bg-slate-50 dark:bg-background-dark relative p-4 lg:p-6 scroll-smooth">
                    {/* Background Pattern */}
                    <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6467f2 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                    {/* Grid Container */}
                    <div className="max-w-5xl mx-auto h-full flex flex-col relative z-10">
                        <GameGrid
                            tiles={tiles}
                            onTileClick={handleTileClick}
                            gridSize={
                                typeof currentGame?.gridSize === 'object' ?
                                    currentGame.gridSize.width :
                                    (currentGame?.gridSize || 20)
                            }
                        />
                    </div>
                </div>

                {/* Right Side: Sidebar (Leaderboard + Stats) - Mobile Drawer / Desktop Static */}
                <aside
                    className={`fixed inset-x-0 bottom-0 lg:static lg:w-[380px] bg-surface-light dark:bg-surface-dark border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/10 flex flex-col shrink-0 z-40 transition-transform duration-300 transform lg:transform-none lg:h-full lg:translate-y-0 h-[60vh] lg:h-auto ${isSidebarOpen ? 'translate-y-0 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]' : 'translate-y-[calc(100%-3.5rem)]'}`}
                >
                    {/* Mobile Toggle Handle Overlay - Only visible on small screens */}
                    <div
                        className="absolute top-0 left-0 right-0 h-14 z-50 lg:hidden cursor-pointer"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-label="Toggle Stats"
                    >
                        <div className="w-12 h-1.5 bg-slate-300 dark:bg-white/20 rounded-full mx-auto mt-3"></div>
                    </div>

                    {/* Sidebar Content */}
                    <div className="flex-1 overflow-hidden h-full flex flex-col section-transition">
                        <Sidebar leaderboard={leaderboard} stats={stats} />
                    </div>
                </aside>

                {/* Game Over Modal */}
                <GameOverModal
                    isOpen={gameState === 'finished'}
                    leaderboard={leaderboard}
                    onReturnToLobby={confirmExit}
                />

                {/* Exit Confirmation Modal */}
                {showExitConfirm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-white/10 animate-scale-in">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-500">
                                    <span className="material-icons-round text-3xl">warning_amber</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Leave Game?</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                        Are you sure you want to surrender and return to the lobby?
                                    </p>
                                </div>
                                <div className="flex gap-3 w-full mt-2">
                                    <button
                                        onClick={() => setShowExitConfirm(false)}
                                        className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmExit}
                                        className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                                    >
                                        Leave
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default GamePage;
