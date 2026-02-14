/**
 * Create Game Panel
 * "Host a Match" card with create button
 */

import React from 'react';

const CreateGamePanel = ({ onCreateClick }) => {
    return (
        <div className="glass-panel p-3 lg:p-6 rounded-xl lg:rounded-2xl relative overflow-hidden group h-full flex flex-col justify-center">
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Mobile View: Compact Card */}
            <div className="lg:hidden flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="material-icons-round text-white text-xl">add</span>
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                        Host Match
                    </h2>
                </div>
            </div>

            {/* Desktop View: Full Content */}
            <div className="hidden lg:block relative">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    Host a Match
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                    Create a new arena and challenge friends.
                </p>

                {/* Create Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCreateClick();
                    }}
                    className="group/btn relative w-full overflow-hidden rounded-xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 transition-all duration-300 group-hover/btn:scale-105" />
                    <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-white font-bold tracking-wide uppercase">
                        <span className="material-icons-round">add_circle</span>
                        Create New Game
                    </div>
                </button>
            </div>

            {/* Mobile Touch Target */}
            <button
                onClick={onCreateClick}
                className="lg:hidden absolute inset-0 w-full h-full z-10"
                aria-label="Create New Game"
            ></button>
        </div>
    );
};

export default CreateGamePanel;
