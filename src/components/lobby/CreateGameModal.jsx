/**
 * Create Game Modal
 * Modal for configuring and creating a new game
 */

import React, { useState } from 'react';
import Modal from '../common/Modal';

const CreateGameModal = ({ isOpen, onClose, onCreateGame, isCreating }) => {
    const [gridSize, setGridSize] = useState('20');
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [isInfinite, setIsInfinite] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const gameConfig = {
            gridSize: parseInt(gridSize),
            maxPlayers: isInfinite ? null : maxPlayers
        };

        onCreateGame(gameConfig);
    };

    const incrementPlayers = () => {
        if (maxPlayers < 100) {
            setMaxPlayers(prev => prev + 1);
        }
    };

    const decrementPlayers = () => {
        if (maxPlayers > 2) {
            setMaxPlayers(prev => prev - 1);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <>
                    <span className="material-icons-round text-primary">sports_esports</span>
                    Create a Match
                </>
            }
            subtitle="Configure your arena settings"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Grid Size Selection */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                        Grid Size
                    </label>
                    <div className="relative">
                        <select
                            value={gridSize}
                            onChange={(e) => setGridSize(e.target.value)}
                            className="w-full bg-[#1e1f35]/80 dark:bg-[#1e1f35]/80 border border-white/10 rounded-xl px-4 py-3 text-white dark:text-white appearance-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer hover:bg-[#1e1f35]"
                            disabled={isCreating}
                        >
                            <option value="20">20x25 (Standard - 500 tiles)</option>
                            <option value="30">30x30 (900 tiles)</option>
                            <option value="40">40x40 (1600 tiles)</option>
                            <option value="50">50x50 (2500 tiles)</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <span className="material-icons-round">expand_more</span>
                        </div>
                    </div>
                </div>

                {/* Max Players */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                            Max Players
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">Infinite</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isInfinite}
                                    onChange={(e) => setIsInfinite(e.target.checked)}
                                    className="sr-only peer"
                                    disabled={isCreating}
                                />
                                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>

                    {!isInfinite && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={decrementPlayers}
                                disabled={maxPlayers <= 2 || isCreating}
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="material-icons-round text-lg">remove</span>
                            </button>
                            <input
                                type="number"
                                value={maxPlayers}
                                onChange={(e) => setMaxPlayers(Math.max(2, Math.min(100, parseInt(e.target.value) || 2)))}
                                min="2"
                                max="100"
                                disabled={isCreating}
                                className="flex-1 bg-[#1e1f35]/80 dark:bg-[#1e1f35]/80 border border-white/10 rounded-xl px-4 py-2.5 text-center text-white dark:text-white font-mono text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={incrementPlayers}
                                disabled={maxPlayers >= 100 || isCreating}
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="material-icons-round text-lg">add</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="group relative w-full overflow-hidden rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-500 to-purple-600 transition-all duration-300 group-hover:scale-105" />
                        <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white font-bold tracking-wide uppercase text-sm">
                            {isCreating ? (
                                <>
                                    <span className="material-icons-round animate-spin">refresh</span>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons-round animate-pulse">rocket_launch</span>
                                    Launch Arena
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateGameModal;
