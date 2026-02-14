/**
 * Game Card Component
 * Individual game card in the lobby list
 */

import React, { useState } from 'react';

const GameCard = ({ game, currentUserId, onJoinGame, onStartGame, onLeaveGame, onCopyId }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyId = () => {
        onCopyId(game.gameId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const isCreator = game.creatorId === currentUserId;
    const isInGame = game.players?.some(p => p.userId === currentUserId);
    const isFull = game.maxPlayers && game.players?.length >= game.maxPlayers;

    // Status badge configuration
    const statusConfig = {
        waiting: {
            bg: 'bg-amber-500/10 dark:bg-amber-500/10',
            text: 'text-amber-500 dark:text-amber-500',
            border: 'border-amber-500/20 dark:border-amber-500/20',
            label: 'Waiting'
        },
        ready: {
            bg: 'bg-green-500/10 dark:bg-green-500/10',
            text: 'text-green-500 dark:text-green-500',
            border: 'border-green-500/20 dark:border-green-500/20',
            label: 'Ready'
        }
    };

    // Determine status: "Ready" if enough players (>=2)
    const isReady = game.players?.length >= 2;
    const status = isReady ? statusConfig.ready : statusConfig.waiting;

    // Show full overlay ONLY if user is NOT in the game
    const showFullOverlay = isFull && !isInGame;

    return (
        <div className={`glass-card p-4 rounded-xl relative group`}>
            {/* Full Overlay - Only for outsiders */}
            {showFullOverlay && (
                <div className="absolute inset-0 bg-[#101122]/80 dark:bg-[#101122]/80 z-20 flex flex-col items-center justify-center backdrop-blur-[1px] rounded-xl border border-white/5 animate-fadeIn">
                    <span className="bg-red-500/20 px-3 py-1 rounded text-xs font-bold text-red-400 uppercase tracking-widest border border-red-500/30 mb-2">
                        Full Lobby
                    </span>
                    <span className="text-xs text-gray-500">
                        {game.players?.length}/{game.maxPlayers} Players
                    </span>
                </div>
            )}

            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">
                        Grid: {typeof game.gridSize === 'object' ? `${game.gridSize.width}x${game.gridSize.height}` : `${game.gridSize}x${game.gridSize}`}
                    </span>
                    <div
                        className="flex items-center gap-2 group-hover:text-primary transition-colors cursor-pointer"
                        onClick={handleCopyId}
                        title="Copy ID"
                    >
                        <span className="font-mono font-bold text-base text-gray-900 dark:text-white">
                            #{game.gameId.slice(0, 8)}...
                        </span>
                        <span className="material-icons-round text-xs opacity-0 group-hover:opacity-50 text-gray-900 dark:text-white transition-opacity">
                            {isCopied ? 'check' : 'content_copy'}
                        </span>
                    </div>
                </div>

                {/* Status Badge */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${status.bg} ${status.text} border ${status.border}`}>
                    {status.label}
                </span>
            </div>

            {/* Players Section */}
            <div className="flex items-center justify-between mt-4">
                {/* Player Avatars */}
                <div className="flex -space-x-2">
                    {game.players?.slice(0, 4).map((player, index) => (
                        <div
                            key={index}
                            className="h-8 w-8 rounded-full ring-2 ring-[#101122] dark:ring-[#101122] flex items-center justify-center text-xs font-bold text-white relative shadow-sm"
                            style={{ backgroundColor: player.color }}
                            title={player.username}
                        >
                            {player.avatar ? (
                                <img src={player.avatar} alt={player.username} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                player.username?.charAt(0).toUpperCase()
                            )}
                        </div>
                    ))}

                    {/* Empty Slots */}
                    {game.maxPlayers && Array.from({ length: Math.max(0, Math.min(4 - (game.players?.length || 0), game.maxPlayers - (game.players?.length || 0))) }).map((_, index) => (
                        <div
                            key={`empty-${index}`}
                            className="h-8 w-8 rounded-full ring-2 ring-[#101122] dark:ring-[#101122] bg-gray-800/50 flex items-center justify-center text-gray-600 border border-dashed border-gray-600"
                        >
                            <span className="material-icons-round text-[10px]">add</span>
                        </div>
                    ))}

                    {/* More players indicator */}
                    {game.players?.length > 4 && (
                        <div className="h-8 w-8 rounded-full ring-2 ring-[#101122] dark:ring-[#101122] bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                            +{game.players.length - 4}
                        </div>
                    )}
                </div>

                {/* Player Count */}
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-white/5 px-2 py-1 rounded-full border border-white/5">
                    {game.players?.length || 0} / {game.maxPlayers || '∞'} Players
                </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-5">
                {isCreator ? (
                    // Creator View: Start Button (always enabled if enough players) + Leave Option?
                    // Usually creator closing lobby disbands it, or we just let them start.
                    // For now, Start Game.
                    <button
                        onClick={() => onStartGame(game.gameId)}
                        // Disable if not enough players (e.g. need 2)
                        disabled={game.players?.length < 1} // Let them start alone for testing? User said "Waiting for host" issue.
                        // Let's stick to multiplayer logic: need at least 1 other?
                        // Actually single player testing is useful. Let's enable if >= 1
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span className="material-icons-round text-sm">play_arrow</span>
                        Start Game
                        {game.players?.length < 2 && <span className="text-[10px] opacity-70 ml-1">(Need more players)</span>}
                    </button>
                ) : isInGame ? (
                    // Participant View: Waiting + Leave Button
                    <div className="flex gap-2">
                        <div className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/5 text-sm font-bold text-gray-400 flex items-center justify-center gap-2 cursor-wait">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Waiting for host...
                        </div>
                        <button
                            onClick={() => onLeaveGame && onLeaveGame(game.gameId)}
                            className="px-3 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 transition-colors flex items-center justify-center group/leave"
                            title="Leave Lobby"
                        >
                            <span className="material-icons-round text-lg group-hover/leave:scale-110 transition-transform">logout</span>
                        </button>
                    </div>
                ) : (
                    // Outsider View: Join Button
                    <button
                        onClick={() => onJoinGame(game.gameId)}
                        disabled={showFullOverlay}
                        className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-sm font-bold text-gray-300 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/join"
                    >
                        <span>Join Lobby</span>
                        <span className="material-icons-round text-sm group-hover/join:translate-x-0.5 transition-transform">arrow_forward</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default GameCard;
