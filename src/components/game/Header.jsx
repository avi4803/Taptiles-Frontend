import React from 'react';

const Header = ({ username, time }) => {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark flex items-center justify-between px-6 z-20 shrink-0 shadow-sm relative">
            {/* Logo Area */}
            <div className="flex items-center gap-3 w-1/4">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-glow">
                    <span className="material-icons text-xl">grid_view</span>
                </div>
                <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">TapTile</h1>
            </div>

            {/* Central Timer */}
            <div className="flex-1 flex justify-center">
                <div className="px-6 py-2 bg-slate-100 dark:bg-background-dark rounded-full border border-slate-200 dark:border-white/5 shadow-inner flex items-center gap-3">
                    <span className="material-icons text-primary text-xl animate-pulse">timer</span>
                    <span className="font-mono text-xl font-bold tracking-widest text-slate-700 dark:text-slate-200 tabular-nums">{time || '00:00'}</span>
                </div>
            </div>

            {/* User & Settings */}
            <div className="w-1/4 flex justify-end items-center gap-4">
                <div className="flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer group">
                    <img alt="User Avatar" className="w-7 h-7 rounded-full shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz7G8wfavvbdvV7JNU2-nUGAlybKrWyMEC_oJzqpEDuLc-IMEqp9PoegOzYnJmq5n2jceq2EKY82nP1lAD17nLuS2LczHH_YOqaeBPiTAiUExACXH7w-ykIQLzhZpKrUdBFvE3_b18Za4FqTrVD9RB5vUAM9jUAqPKG658b9wJScqfBE_BBDfdd4EK-Xp0fvZoy4jo3n9ik7rzvubUGsym8iUR5X7xJ1JuPxpsl3Hf0fKNtyM-AWp_5HkrZau-MrAt7dY8ot3jv3T1" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors text-slate-700 dark:text-slate-200">{username || 'PlayerName'}</span>
                </div>
                <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 dark:text-slate-400 hover:text-primary transition-colors">
                    <span className="material-icons">settings</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
