/**
 * Join Game Panel
 * "Have a Code?" card with quick join input
 */

import React, { useState } from 'react';

const JoinGamePanel = ({ onJoinClick, onQuickJoin }) => {
    const [quickCode, setQuickCode] = useState('');

    const handleQuickJoin = () => {
        if (quickCode.trim().length === 6) {
            onQuickJoin(quickCode.trim().toUpperCase());
            setQuickCode('');
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
        setQuickCode(value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && quickCode.trim().length === 6) {
            handleQuickJoin();
        }
    };

    return (
        <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col justify-center">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Have a Code?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Enter the 6-digit lobby ID to join instantly.
            </p>

            {/* Quick Join Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={quickCode}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="ABC123"
                    maxLength={6}
                    className="w-full bg-black/20 dark:bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-center font-mono text-lg tracking-widest uppercase placeholder-gray-600 dark:placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white"
                />
                <button
                    onClick={handleQuickJoin}
                    disabled={quickCode.length !== 6}
                    className="px-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-900 dark:text-white"
                >
                    <span className="material-icons-round">arrow_forward</span>
                </button>
            </div>

            {/* Or use modal button */}
            <button
                onClick={onJoinClick}
                className="mt-4 text-sm text-gray-500 dark:text-gray-500 hover:text-primary dark:hover:text-primary transition-colors text-center"
            >
                Or click here for more options
            </button>
        </div>
    );
};

export default JoinGamePanel;
