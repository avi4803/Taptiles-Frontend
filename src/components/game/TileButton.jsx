import React from 'react';

const TileButton = ({ status = 'unclaimed', label, onClick, ...props }) => {
    // Base styles common to all tiles
    const baseStyles = "aspect-square rounded-lg transition-all duration-150 cubic-bezier(0.4, 0, 0.2, 1) flex items-center justify-center relative overflow-hidden";

    // Configuration for different statuses
    const statusConfig = {
        'user': {
            classes: "bg-primary shadow-md shadow-primary/30 border-2 border-primary/50 cursor-pointer group hover:scale-[1.02] active:scale-95",
            content: (
                <>
                    <span className="material-icons text-white text-2xl md:text-3xl font-bold drop-shadow-md transform group-hover:scale-110 transition-transform">check</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </>
            )
        },
        'opponent-red': {
            classes: "bg-rose-500 shadow-sm border-2 border-rose-400 cursor-not-allowed opacity-90",
            content: <span className="font-display font-bold text-white text-xl tracking-wider drop-shadow-sm">{label || 'OP'}</span>
        },
        'opponent-teal': {
            classes: "bg-teal-500 shadow-sm border-2 border-teal-400 cursor-not-allowed opacity-90",
            content: <span className="font-display font-bold text-white text-xl tracking-wider drop-shadow-sm">{label || 'OP'}</span>
        },
        'opponent-amber': {
            classes: "bg-amber-500 shadow-sm border-2 border-amber-400 cursor-not-allowed opacity-90",
            content: <span className="font-display font-bold text-white text-xl tracking-wider drop-shadow-sm">{label || 'OP'}</span>
        },
        'unclaimed': {
            classes: "bg-slate-100 dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/10 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer group active:scale-95",
            content: (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-icons text-primary/40 text-2xl">add</span>
                </div>
            )
        }
    };

    const config = statusConfig[status] || statusConfig['unclaimed'];

    return (
        <div
            className={`${baseStyles} ${config.classes}`}
            onClick={status === 'user' || status === 'unclaimed' ? onClick : undefined}
            {...props}
        >
            {config.content}
        </div>
    );
};

export default TileButton;
