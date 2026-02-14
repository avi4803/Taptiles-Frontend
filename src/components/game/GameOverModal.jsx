import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GameOverModal = ({ isOpen, leaderboard, onReturnToLobby }) => {
    if (!isOpen) return null;

    // Get the winner (rank 1)
    const winner = leaderboard && leaderboard.length > 0 ? leaderboard[0] : null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
                >
                    {/* Header with Winner Highlight */}
                    <div className="relative p-6 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20" />

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="relative z-10 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg mb-4"
                        >
                            <span className="material-icons text-4xl text-white">emoji_events</span>
                        </motion.div>

                        <h2 className="relative z-10 text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            Game Over!
                        </h2>

                        {winner && (
                            <p className="relative z-10 text-slate-600 dark:text-slate-300">
                                <span className="font-semibold text-primary-500">{winner.username}</span> wins the match!
                            </p>
                        )}
                    </div>

                    {/* Leaderboard Summary */}
                    <div className="p-6 pt-2">
                        <div className="bg-slate-50 dark:bg-background-dark/50 rounded-xl p-4 mb-6 border border-slate-100 dark:border-white/5 max-h-60 overflow-y-auto custom-scrollbar">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Final Standings</h3>

                            <div className="space-y-3">
                                {leaderboard.map((player, index) => (
                                    <div key={player.username} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                                ${index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    index === 1 ? 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300' :
                                                        index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                                                            'text-slate-400'}
                                            `}>
                                                {index + 1}
                                            </div>

                                            {/* Avatar/Color */}
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white shadow-sm border border-white/10"
                                                style={{ backgroundColor: player.color || '#6366f1' }}
                                            >
                                                {player.username.substring(0, 2).toUpperCase()}
                                            </div>

                                            <span className="font-medium text-slate-700 dark:text-slate-200">
                                                {player.username}
                                            </span>
                                        </div>

                                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                                            {player.pts} <span className="text-xs font-normal text-slate-400">pts</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onReturnToLobby}
                            className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium shadow-lg shadow-primary-500/25 transition-all"
                        >
                            Return to Lobby
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GameOverModal;
