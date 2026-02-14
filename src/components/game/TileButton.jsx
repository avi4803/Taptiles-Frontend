import React from 'react';

const TileButton = ({ status = 'unclaimed', label, color, onClick, ...props }) => {
    // Base styles common to all tiles
    const baseStyles = "aspect-square rounded-lg transition-all duration-150 cubic-bezier(0.4, 0, 0.2, 1) flex items-center justify-center relative overflow-hidden";

    // Dynamic styles based on color prop
    let dynamicStyles = {};
    if ((status === 'user' || status === 'opponent') && color) {
        dynamicStyles = {
            backgroundColor: color,
            borderColor: color,
            boxShadow: status === 'user' ? `0 4px 12px ${color}40` : 'none'
        };
    }

    // Configuration for different statuses
    const statusConfig = {
        'user': {
            classes: `shadow-md border-2 cursor-pointer group hover:scale-[1.02] active:scale-95 ${!color ? 'bg-primary border-primary shadow-primary/30' : 'text-white'}`,
            content: (
                <>
                    <span className="material-icons-round text-white text-2xl md:text-3xl font-bold drop-shadow-md transform group-hover:scale-110 transition-transform">check</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </>
            )
        },
        'opponent': {
            classes: `shadow-sm border-2 cursor-not-allowed opacity-90 ${!color ? 'bg-gray-400 border-gray-400' : 'text-white'}`,
            content: <span className="font-display font-bold text-xl tracking-wider drop-shadow-sm">{label || 'OP'}</span>
        },
        'unclaimed': {
            classes: "bg-slate-100 dark:bg-white/[0.03] border-2 border-slate-200 dark:border-white/10 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer group active:scale-95",
            content: (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-icons-round text-primary/40 text-2xl">add</span>
                </div>
            )
        }
    };

    // Fallback for mock statuses if they still exist briefly
    const effectiveStatus = status.startsWith('opponent') ? 'opponent' : status;
    const config = statusConfig[effectiveStatus] || statusConfig['unclaimed'];

    return (
        <button
            className={`${baseStyles} ${config.classes}`}
            style={dynamicStyles}
            onClick={(status === 'user' || status === 'unclaimed') ? onClick : undefined}
            disabled={status === 'opponent'}
            {...props}
        >
            {config.content}
        </button>
    );
};

export default TileButton;
