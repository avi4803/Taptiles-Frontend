/**
 * Game List Component
 * Grid of available games with filters
 */

import React, { useState } from 'react';
import GameCard from './GameCard';

const GameList = ({ games, currentUserId, onJoinGame, onStartGame, onLeaveGame, onRefresh, isRefreshing }) => {
    const [filter, setFilter] = useState('all'); // 'all', 'your', 'public'

    // Filter games based on selected filter
    const filteredGames = games.filter(game => {
        if (filter === 'your') {
            return game.players?.some(p => p.userId === currentUserId);
        }
        if (filter === 'public') {
            return !game.players?.some(p => p.userId === currentUserId);
        }
        return true; // 'all'
    });

    const handleCopyId = (gameId) => {
        navigator.clipboard.writeText(gameId);
    };

    return (
        <div className="w-full flex flex-col h-full overflow-hidden">
            {/* Header with Filters */}
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="material-icons-round text-primary">dns</span>
                    Public Lobbies
                </h3>

                <div className="flex gap-2 relative">
                    {/* Refresh Button */}
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="p-2 rounded-lg bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
                        title="Refresh"
                    >
                        <span className={`material-icons-round text-sm ${isRefreshing ? 'animate-spin' : ''}`}>
                            refresh
                        </span>
                    </button>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="p-2 pl-3 pr-8 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-colors appearance-none cursor-pointer text-sm font-medium border border-gray-200 dark:border-white/10 outline-none focus:ring-1 focus:ring-primary/50"
                        >
                            <option value="all" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">All Games</option>
                            <option value="your" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Your Games</option>
                            <option value="public" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Public Games</option>
                        </select>
                        {/* Dropdown Arrow */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                            <span className="material-icons-round text-sm text-gray-500 dark:text-gray-400">
                                expand_more
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pb-20 pr-2 custom-scrollbar">
                {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                        <GameCard
                            key={game.gameId}
                            game={game}
                            currentUserId={currentUserId}
                            onJoinGame={onJoinGame}
                            onStartGame={onStartGame}
                            onLeaveGame={onLeaveGame}
                            onCopyId={handleCopyId}
                        />
                    ))
                ) : (
                    // Empty State
                    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-24 h-24 rounded-full bg-white/5 dark:bg-white/5 flex items-center justify-center mb-4">
                            <span className="material-icons-round text-5xl text-gray-600 dark:text-gray-400">
                                sports_esports
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            No games available
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm text-center max-w-sm">
                            {filter === 'your'
                                ? "You haven't joined any games yet. Create one or join an existing game!"
                                : "Be the first to create a game and start playing!"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameList;
