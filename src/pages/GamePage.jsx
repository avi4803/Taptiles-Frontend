import React from 'react';
import Header from '../components/game/Header';
import GameGrid from '../components/game/GameGrid';
import Sidebar from '../components/game/Sidebar';
import ConnectionStatus from '../components/common/ConnectionStatus';
import { useGameLogic } from '../hooks/useGameLogic';


const GamePage = ({ username }) => {
    const { tiles, handleTileClick, formattedTime, leaderboard } = useGameLogic(username);

    return (
        <div className="h-screen w-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display overflow-hidden">
            {/* Connection Status Indicator */}
            <ConnectionStatus />

            {/* Header - Fixed at top */}
            <Header username={username} time={formattedTime} />

            {/* Main Content Area - Takes remaining height */}
            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Side: Game Grid - Scrollable independently */}
                <div className="flex-1 h-full overflow-hidden">
                    <GameGrid tiles={tiles} onTileClick={handleTileClick} />
                </div>

                {/* Right Side: Sidebar (Leaderboard + Stats) - Scrollable independently */}
                <div className="w-full lg:w-[380px] h-[40vh] lg:h-full flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/10 overflow-hidden">
                    <Sidebar leaderboard={leaderboard} />
                </div>
            </main>
        </div>
    );
};

export default GamePage;
