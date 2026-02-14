import React from 'react';
import Header from '../components/game/Header';
import GameGrid from '../components/game/GameGrid';
import Sidebar from '../components/game/Sidebar';
import ConnectionStatus from '../components/common/ConnectionStatus';
import GameOverModal from '../components/game/GameOverModal'; // Import Modal
import { useGameLogic } from '../hooks/useGameLogic';
import { useGame } from '../context/GameContext'; // Import context to get grid size

const GamePage = ({ username, onExit }) => {
    const { tiles, handleTileClick, formattedTime, leaderboard, gameState } = useGameLogic(username);
    const { currentGame, leaveGameRoom } = useGame();

    const handleReturnToLobby = () => {
        leaveGameRoom();
        if (onExit) onExit();
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display overflow-hidden">
            {/* Connection Status Indicator */}
            <ConnectionStatus />

            {/* Header - Fixed at top */}
            <Header username={username} time={formattedTime} />

            {/* Main Content Area - Takes remaining height */}
            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                {/* Left Side: Game Grid - Scrollable independently */}
                <div className="flex-1 h-full overflow-hidden">
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

                {/* Right Side: Sidebar (Leaderboard + Stats) - Scrollable independently */}
                <div className="w-full lg:w-[380px] h-[40vh] lg:h-full flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/10 overflow-hidden">
                    <Sidebar leaderboard={leaderboard} />
                </div>

                {/* Game Over Modal */}
                <GameOverModal
                    isOpen={gameState === 'finished'}
                    leaderboard={leaderboard}
                    onReturnToLobby={handleReturnToLobby}
                />
            </main>
        </div>
    );
};

export default GamePage;
