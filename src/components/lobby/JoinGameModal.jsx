/**
 * Join Game Modal
 * Modal for entering game ID to join
 */

import React, { useState, useRef, useEffect } from 'react';
import Modal from '../common/Modal';

const JoinGameModal = ({ isOpen, onClose, onJoinGame, isJoining, error }) => {
    const [gameId, setGameId] = useState('');
    const inputRef = useRef(null);

    // Auto-focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Clear input when modal closes
    useEffect(() => {
        if (!isOpen) {
            setGameId('');
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (gameId.trim().length >= 6) {
            onJoinGame(gameId.trim().toUpperCase());
        }
    };

    const handleInputChange = (e) => {
        // Only allow alphanumeric characters and limit to 6 characters
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
        setGameId(value);
    };

    const isValid = gameId.trim().length === 6;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <>
                    <span className="material-icons-round text-primary">vpn_key</span>
                    Join Game
                </>
            }
            subtitle="Enter the 6-digit game code"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Game ID Input */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                        Game Code
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={gameId}
                        onChange={handleInputChange}
                        placeholder="ABC123"
                        maxLength={6}
                        disabled={isJoining}
                        className="w-full bg-[#1e1f35]/80 dark:bg-[#1e1f35]/80 border border-white/10 rounded-xl px-4 py-4 text-center font-mono text-2xl tracking-widest uppercase placeholder-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all text-white dark:text-white"
                    />
                    <p className="text-xs text-gray-500 text-center">
                        {gameId.length}/6 characters
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                        <p className="text-red-400 text-sm font-medium text-center flex items-center justify-center gap-2">
                            <span className="material-icons-round text-base">error</span>
                            {error}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isJoining}
                        className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid || isJoining}
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                        {isJoining ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-icons-round animate-spin text-sm">refresh</span>
                                Joining...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-icons-round text-sm">arrow_forward</span>
                                Join Game
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default JoinGameModal;
