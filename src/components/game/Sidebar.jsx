import React from 'react';

const LeaderboardItem = ({ rank, username, pts, active, avatar, extra }) => {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors group cursor-pointer border border-transparent 
            ${active
                ? 'bg-primary/20 border-primary/50 shadow-glow relative overflow-hidden'
                : 'hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'}`}>

            {active && <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>}

            <div className={`w-8 font-mono font-bold text-lg text-center relative z-10 
                ${rank === 1 ? 'text-amber-400' :
                    rank === 2 ? 'text-slate-400' :
                        rank === 3 ? 'text-slate-500' :
                            active ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>
                #{rank}
            </div>

            <div className="relative z-10">
                <img
                    alt={`${username} Avatar`}
                    className={`w-10 h-10 rounded-full ${active ? 'ring-2 ring-primary/50' : ''}`}
                    src={avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBz7G8wfavvbdvV7JNU2-nUGAlybKrWyMEC_oJzqpEDuLc-IMEqp9PoegOzYnJmq5n2jceq2EKY82nP1lAD17nLuS2LczHH_YOqaeBPiTAiUExACXH7w-ykIQLzhZpKrUdBFvE3_b18Za4FqTrVD9RB5vUAM9jUAqPKG658b9wJScqfBE_BBDfdd4EK-Xp0fvZoy4jo3n9ik7rzvubUGsym8iUR5X7xJ1JuPxpsl3Hf0fKNtyM-AWp_5HkrZau-MrAt7dY8ot3jv3T1"}
                />
                {rank === 1 && (
                    <div className="absolute -bottom-1 -right-1 bg-amber-400 text-surface-dark text-[10px] font-bold px-1 rounded-sm shadow-sm">KING</div>
                )}
            </div>

            <div className="flex-1 relative z-10">
                <h3 className={`font-bold text-sm ${active ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>{username}</h3>
                <p className={`text-xs ${active ? 'text-primary/80 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>{extra || 'Player'}</p>
            </div>

            <div className="text-right relative z-10">
                <div className={`font-mono font-bold ${active ? 'text-white text-lg' : 'text-slate-400'}`}>{pts}</div>
                <div className={`text-[10px] uppercase ${active ? 'text-primary/80 font-bold' : 'text-slate-500'}`}>pts</div>
            </div>
        </div>
    );
};

const Sidebar = ({ leaderboard = [] }) => {
    return (
        <aside className="w-full h-full bg-surface-light dark:bg-surface-dark flex flex-col shrink-0 z-20">
            {/* Leaderboard Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <span className="text-amber-400 text-xl">🏆</span> Leaderboard
                    </h2>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded uppercase tracking-wider">Live</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Top 50 players in this match</p>
            </div>

            {/* Leaderboard List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
                {leaderboard.map((player) => (
                    <LeaderboardItem key={player.rank} {...player} />
                ))}

                {leaderboard.length === 0 && (
                    <div className="text-center py-8 text-slate-500">No players yet</div>
                )}
            </div>

            {/* Stats Card */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-background-dark/50">
                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-white/5 rounded-xl p-4 shadow-lg">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                        <span className="material-icons text-base">analytics</span> Your Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg border border-slate-200 dark:border-white/5">
                            <div className="text-xs text-slate-500 mb-1">Tiles Claimed</div>
                            <div className="text-2xl font-bold font-mono text-primary">45</div>
                            <div className="text-[10px] text-green-500 flex items-center mt-1">
                                <span className="material-icons text-[10px] mr-0.5">arrow_upward</span> +3/min
                            </div>
                        </div>
                        <div className="bg-background-light dark:bg-background-dark p-3 rounded-lg border border-slate-200 dark:border-white/5">
                            <div className="text-xs text-slate-500 mb-1">Speed</div>
                            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">1.2<span className="text-sm font-sans font-normal text-slate-500 ml-1">s</span></div>
                            <div className="text-[10px] text-slate-500 mt-1">Avg per tile</div>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
                            <span>Dominance</span>
                            <span>12%</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-indigo-400 w-[12%] rounded-full shadow-glow"></div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
