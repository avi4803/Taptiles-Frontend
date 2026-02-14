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
            <div ref={containerRef} className="flex-1 overflow-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* Center Button Overlay */}
                <button
                    onClick={handleCenter}
                    className="sticky top-4 left-[calc(100%-3rem)] z-50 p-3 bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl text-slate-700 dark:text-white hover:bg-white/20 dark:hover:bg-black/50 transition-all shadow-lg"
                    title="Center Map"
                >
                    <span className="material-icons-round">zoom_out_map</span>
                </button>

                <div className="min-h-full min-w-fit flex items-center justify-center p-4 md:p-6">
                    {/* The Game Board */}
                    <div
                        className="grid gap-[2px] md:gap-2 p-2 bg-white dark:bg-surface-dark rounded-xl shadow-2xl border border-slate-200 dark:border-white/5 relative z-10 mx-auto transition-transform duration-200"
                        style={{
                            gridTemplateColumns: `repeat(${gridSize}, minmax(40px, 1fr))`
                        }}
                    >
                        {tiles.map((tile) => (
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
        </div>
    );
};

export default GameGrid;
