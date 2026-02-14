/**
 * Lobby Page
 * Main game lobby where users can create/join games
 */

import React, { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useGameLobby } from '../hooks/useGameLobby';
import { useGameActions } from '../hooks/useGameActions';
import ConnectionStatus from '../components/common/ConnectionStatus';
import CreateGamePanel from '../components/lobby/CreateGamePanel';
import JoinGamePanel from '../components/lobby/JoinGamePanel';
import GameList from '../components/lobby/GameList';
import CreateGameModal from '../components/lobby/CreateGameModal';
import JoinGameModal from '../components/lobby/JoinGameModal';

const LobbyPage = ({ onGameStart }) => {
    const { userData, onlineUsers, disconnect } = useSocket();
    const { availableGames, isRefreshing, fetchGames } = useGameLobby();
    const { createGame, joinGame, startGame, leaveGame, isCreating, isJoining, error, clearError } = useGameActions();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    // Handle create game
    const handleCreateGame = async (config) => {
        await createGame(config);
        setShowCreateModal(false);
    };

    // Handle join game
    const handleJoinGame = async (gameId) => {
        await joinGame(gameId);
        if (!error) {
            setShowJoinModal(false);
        }
    };

    // Handle quick join from panel
    const handleQuickJoin = async (gameId) => {
        await joinGame(gameId);
    };

    // Handle start game
    const handleStartGame = async (gameId) => {
        await startGame(gameId);
        // Navigation to game page will be handled by socket event
    };

    // Handle leave game
    const handleLeaveGame = async (gameId) => {
        await leaveGame(gameId);
    };

    // Handle logout
    const handleLogout = () => {
        disconnect();
        localStorage.removeItem('tapTileState');
        window.location.reload();
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white h-screen w-full overflow-hidden selection:bg-primary selection:text-white">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-40 dark:opacity-30 bg-[radial-gradient(circle_at_50%_-20%,#5b5df1_0%,transparent_50%)]" />
                <div className="absolute inset-0 opacity-20 dark:opacity-20 bg-[radial-gradient(circle_at_0%_50%,#8b5cf6_0%,transparent_40%)]" />
                <div className="absolute inset-0 opacity-20 dark:opacity-20 bg-[radial-gradient(circle_at_100%_80%,#3b82f6_0%,transparent_40%)]" />

                {/* Floating Decorative Elements */}
                <div className="absolute top-20 left-[10%] w-24 h-24 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-white/10 rotate-12 animate-float-slow backdrop-blur-sm" />
                <div className="absolute bottom-32 right-[15%] w-32 h-32 rounded-xl bg-gradient-to-tl from-purple-500/20 to-transparent border border-white/10 -rotate-6 animate-float-medium backdrop-blur-sm" />
                <div className="absolute top-40 right-[20%] w-16 h-16 rounded-lg bg-gradient-to-b from-blue-500/20 to-transparent border border-white/10 rotate-45 animate-float-fast backdrop-blur-sm" />
                <div className="absolute bottom-20 left-[20%] w-12 h-12 rounded-lg bg-white/5 border border-white/5 rotate-12 animate-float-slow backdrop-blur-sm" />
            </div>

            {/* Main Content */}
            <main className="relative z-10 flex flex-col h-screen max-w-7xl mx-auto px-4 md:px-6 py-6 overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between mb-8 md:mb-12">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-white/60">
                            TapTile
                        </h1>
                        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                {onlineUsers} ONLINE
                            </span>
                        </div>
                    </div>

                    {/* User Info & Actions */}
                    <div className="flex items-center gap-2">
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="p-2 w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors border border-red-500/10"
                            title="Log Out"
                        >
                            <span className="material-icons-round text-lg">logout</span>
                        </button>

                        {/* Profile Badge (No action) */}
                        <div
                            className="flex items-center gap-3 px-4 py-2 rounded-xl glass-panel"
                        >
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                                style={{ backgroundColor: userData?.color || '#ec4899' }}
                            >
                                <span className="material-icons-round text-white text-sm">person</span>
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                                    {userData?.username || 'Player'}
                                </p>
                                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide mt-1">
                                    {userData?.userId?.slice(0, 8) || 'Guest'}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
                    {/* Left Panel - Create/Join */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <CreateGamePanel onCreateClick={() => setShowCreateModal(true)} />
                        <JoinGamePanel
                            onJoinClick={() => setShowJoinModal(true)}
                            onQuickJoin={handleQuickJoin}
                        />
                    </div>

                    {/* Right Panel - Game List */}
                    <div className="w-full lg:w-2/3 flex flex-col h-full overflow-hidden">
                        <GameList
                            games={availableGames}
                            currentUserId={userData?.userId}
                            onJoinGame={handleJoinGame}
                            onStartGame={handleStartGame}
                            onLeaveGame={handleLeaveGame}
                            onRefresh={fetchGames}
                            isRefreshing={isRefreshing}
                        />
                    </div>
                </div>
            </main>

            {/* Modals */}
            <CreateGameModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateGame={handleCreateGame}
                isCreating={isCreating}
            />

            <JoinGameModal
                isOpen={showJoinModal}
                onClose={() => {
                    setShowJoinModal(false);
                    clearError();
                }}
                onJoinGame={handleJoinGame}
                isJoining={isJoining}
                error={error}
            />
        </div>
    );
};

export default LobbyPage;
