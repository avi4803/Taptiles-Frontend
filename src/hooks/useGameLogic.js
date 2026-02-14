/**
 * useGameLogic Hook
 * Manages the core game loop, tile interactions, and real-time updates
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSocket } from './useSocket';
import { useGame } from '../context/GameContext';
import { SOCKET_EVENTS } from '../utils/constants';

export const useGameLogic = () => {
    const { currentGame } = useGame();
    const { socket, on, emit, userData } = useSocket();
    
    // Game State
    const [gameState, setGameState] = useState('active'); // 'active', 'finished'
    
    // Calculate initial time left based on server endTime if available
    const getInitialTime = () => {
        if (currentGame?.endTime) {
            const remaining = Math.max(0, Math.floor((currentGame.endTime - Date.now()) / 1000));
            return remaining;
        }
        return currentGame?.duration ? currentGame.duration / 1000 : 300;
    };

    const [timeLeft, setTimeLeft] = useState(getInitialTime);

    // Grid State
    // Initialize with empty tiles based on grid size
    const [tiles, setTiles] = useState(() => {
        let total = 400; // Default
        if (currentGame) {
            if (currentGame.totalTiles) {
                total = currentGame.totalTiles;
            } else if (currentGame.gridSize) {
                if (typeof currentGame.gridSize === 'object') {
                    total = currentGame.gridSize.width * currentGame.gridSize.height;
                } else if (typeof currentGame.gridSize === 'number') {
                    total = currentGame.gridSize * currentGame.gridSize;
                }
            }
        }
        
        console.log(`🧩 Initializing grid with ${total} tiles (Game: ${currentGame?.gameId})`);
        
        return Array.from({ length: total }, (_, i) => ({ 
            id: i, 
            status: 'unclaimed',
            color: null,
            label: null,
            ownerId: null
        }));
    });

    // Valid tile check
    const isMyTile = (tile) => tile.ownerId === userData?.userId;

    /**
     * Handle Tile Click
     */
    const handleTileClick = useCallback((id) => {
        // Debugging logs
        console.log(`🖱️ Tile Clicked: ${id} | Game: ${currentGame?.gameId} | State: ${gameState} | Active: ${currentGame?.status}`);

        if (!currentGame) return;
        
        // Allow clicking if local state is active OR backend state is active
        // Sometimes sync might lag, but if user sees board, they should be able to click
        if (gameState !== 'active' && currentGame.status !== 'active') {
             console.warn('Click ignored: Game not active');
             return;
        }

        // Optimistic UI Update
        setTiles(prev => {
            const newTiles = [...prev];
             // Only update if not already ours to avoid flicker/redraw
            if (newTiles[id] && newTiles[id].ownerId !== userData?.userId) {
                 newTiles[id] = {
                    ...newTiles[id],
                    status: 'user',
                    color: userData?.color || '#ec4899', // Fallback color
                    ownerId: userData?.userId,
                    ownerId: userData?.userId,
                    username: userData?.username,
                    label: userData?.username?.substring(0, 2).toUpperCase()
                };
            }
            return newTiles;
        });
        
        emit('claimTile', { 
            gameId: currentGame.gameId, 
            tileId: id 
        });
    }, [currentGame, gameState, emit, userData]);

    // Check for "All Tiles Claimed" Game Over condition
    useEffect(() => {
        if (gameState === 'active' && tiles.length > 0) {
            const allClaimed = tiles.every(t => t.ownerId !== null);
            if (allClaimed) {
                console.log('🏁 All tiles claimed! Ending game locally.');
                setGameState('finished');
                setTimeLeft(0);
            }
        }
    }, [tiles, gameState]);

    /**
     * Socket Event Listeners
     */
    useEffect(() => {
        if (!socket || !currentGame) return;

        // 1. Fetch initial tiles state
        emit('getTiles', { gameId: currentGame.gameId });

        // 2. Handle Initial Tiles Data
        on('tilesData', (data) => {
            if (data.gameId === currentGame.gameId && data.tiles) {
                console.log('📥 Received initial tiles data:', Object.keys(data.tiles).length, 'tiles');
                
                setTiles(prev => {
                    const newTiles = [...prev];
                    // Handle both Array and Object (Map) response from Redis
                    const tilesCollection = data.tiles;
                    
                    // If it's an object, iterate keys
                    Object.values(tilesCollection).forEach(t => {
                        const tId = t.tileId !== undefined ? t.tileId : t.id;
                        if (newTiles[tId]) {
                            newTiles[tId] = {
                                ...newTiles[tId],
                                status: t.ownerId === userData?.userId ? 'user' : 'opponent',
                                color: t.color,
                                ownerId: t.ownerId,
                                label: t.username?.substring(0, 2).toUpperCase(),
                                username: t.username
                            };
                        }
                    });
                    return newTiles;
                });
            }
        });

        // 3. Handle Batch Updates (Real-time)
        on('batchUpdate', (data) => {
            console.log('⚡ Received batch update:', data);
            // Support both data.updates (new format) or direct array (legacy)
            const updates = data.updates || data; 
            
            if (!Array.isArray(updates)) {
                console.warn('⚠️ Batch update invalid format:', typeof data);
                return;
            }

            setTiles(prev => {
                const newTiles = [...prev];
                let changed = false;
                
                updates.forEach(u => {
                   // Ensure tileId is integer for array index
                   const tId = parseInt(u.tileId);
                   
                   if (newTiles[tId]) {
                        console.log(`🔄 Updating tile ${tId} -> Owner: ${u.username}`);
                        newTiles[tId] = {
                            ...newTiles[tId],
                            status: u.userId === userData?.userId ? 'user' : 'opponent',
                            color: u.color,
                            ownerId: u.userId,
                            username: u.username, // Store username
                            label: u.username?.substring(0, 2).toUpperCase()
                        };
                        changed = true;
                    } else {
                        console.warn(`⚠️ Batch update for unknown tile: ${tId}`);
                    }
                });
                
                return changed ? newTiles : prev;
            });
        });

        // 4. Handle Game Ended
        on('gameEnded', (data) => {
            if (data.gameId === currentGame.gameId) {
                setGameState('finished');
                setTimeLeft(0);
                // We can also trigger the modal here or let the UI react to gameState === 'finished'
            }
        });

        // 5. Sync Time if needed (optional 'timerSync' event could be added to backend)
        
    }, [socket, currentGame, emit, on, userData]);

    // Derived Leaderboard (Calculate from tiles)
    const leaderboard = useMemo(() => {
        const scores = {};
        
        // 1. Initialize with current players
        if (currentGame?.players) {
            currentGame.players.forEach(p => {
                scores[p.userId] = { 
                    userId: p.userId,
                    username: p.username, 
                    color: p.color,
                    avatar: p.avatar,
                    pts: 0 
                };
            });
        }

        // 2. Sum up tiles and discover new players from tiles
        tiles.forEach(t => {
            if (t.ownerId) {
                if (!scores[t.ownerId]) {
                    // If player not in list (e.g. left game or incomplete list), create entry
                    // We might not have full details, but we try our best
                    scores[t.ownerId] = {
                        userId: t.ownerId,
                        username: t.username || `Player ${t.label || t.ownerId.slice(0,4)}`, // Fallback
                        color: t.color,
                        pts: 0
                    };
                }
                scores[t.ownerId].pts += 10;
            }
        });

        return Object.values(scores)
            .sort((a, b) => b.pts - a.pts)
            .map((p, i) => ({
                rank: i + 1,
                userId: p.userId,
                username: p.username,
                pts: p.pts,
                avatar: p.avatar,
                extra: 'Player',
                color: p.color,
                active: p.userId === userData?.userId
            }));
    }, [tiles, currentGame, userData]);

    // Timer Logic - Syncs with real time
    useEffect(() => {
        if (gameState === 'finished') return;

        const interval = setInterval(() => {
            if (currentGame?.endTime) {
                const remaining = Math.max(0, Math.floor((currentGame.endTime - Date.now()) / 1000));
                setTimeLeft(remaining);
                if (remaining <= 0) setGameState('finished');
            } else {
                // Fallback if no endTime (shouldn't happen in active game)
                setTimeLeft(prev => {
                    if (prev <= 0) {
                        setGameState('finished');
                        return 0;
                    }
                    return prev - 1;
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentGame, gameState]);

    const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

    return {
        tiles,
        handleTileClick,
        timeLeft,
        formattedTime,
        leaderboard,
        gameState,
        onlineUsers: useSocket().onlineUsers // Direct access
    };
};
