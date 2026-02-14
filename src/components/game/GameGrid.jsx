import React from 'react';
import TileButton from './TileButton';

const GameGrid = ({ tiles = [], onTileClick, gridSize = 20, onSurrender }) => {
    const containerRef = React.useRef(null);

    const handleCenter = () => {
        if (containerRef.current) {
            const { scrollWidth, scrollHeight, clientWidth, clientHeight } = containerRef.current;
            containerRef.current.scrollTo({
                left: (scrollWidth - clientWidth) / 2,
                top: (scrollHeight - clientHeight) / 2,
                behavior: 'smooth'
            });
        }
    };

    // Auto-center on mount
    React.useEffect(() => {
        // Short delay to ensure layout is done
        setTimeout(handleCenter, 100);
    }, []);

    return (
        <div className="h-full w-full flex flex-col bg-slate-50 dark:bg-background-dark relative">
            {/* Background Grid Pattern Decoration - Fixed to viewport */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-grid-pattern"></div>

            {/* Scrollable Content Area */}
            <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="min-h-full flex items-center justify-center p-4 md:p-6">
                    {/* The Game Board */}
                    <div
                        className="w-full max-w-5xl grid gap-1 md:gap-2 p-2 bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-200 dark:border-white/5 relative z-10"
                        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
                    >
                        {tiles.map(tile => (
                            <TileButton
                                key={tile.id}
                                status={tile.status}
                                label={tile.label}
                                color={tile.color}
                                onClick={() => onTileClick && onTileClick(tile.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Action Floating Bar - Sticky at bottom */}
            <div className="sticky bottom-0 left-0 right-0 flex justify-center py-4 pointer-events-none z-20">
                <div className="flex gap-3 md:gap-4 bg-surface-dark/90 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/10 shadow-2xl pointer-events-auto">
                    <button
                        onClick={handleCenter}
                        className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        <span className="material-icons text-sm md:text-base">zoom_out_map</span>
                        <span className="hidden sm:inline">Center</span>
                    </button>
                    <div className="w-px bg-white/20 h-4 md:h-5 my-auto"></div>
                    <button
                        onClick={onSurrender}
                        className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        <span className="material-icons text-sm md:text-base">flag</span>
                        <span className="hidden sm:inline">Surrender</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameGrid;
