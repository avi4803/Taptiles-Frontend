/**
 * Game Context
 * Manages game state across the application
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
};

export const GameProvider = ({ children }) => {
    const [currentGame, setCurrentGame] = useState(null);
    const [availableGames, setAvailableGames] = useState([]);
    const [isInGame, setIsInGame] = useState(false);

    /**
     * Set the current game user is in
     */
    const joinGameRoom = useCallback((gameData) => {
        setCurrentGame(gameData);
        setIsInGame(true);
    }, []);

    /**
     * Leave current game
     */
    const leaveGameRoom = useCallback(() => {
        setCurrentGame(null);
        setIsInGame(false);
    }, []);

    /**
     * Update available games list
     */
    const updateAvailableGames = useCallback((games) => {
        setAvailableGames(games);
    }, []);

    /**
     * Add a new game to the list
     */
    const addGame = useCallback((game) => {
        setAvailableGames(prev => {
            if (prev.some(g => g.gameId === game.gameId)) {
                return prev;
            }
            return [game, ...prev];
        });
    }, []);

    /**
     * Remove a game from the list
     */
    const removeGame = useCallback((gameId) => {
        setAvailableGames(prev => prev.filter(g => g.gameId !== gameId));
    }, []);

    /**
     * Update a specific game in the list
     */
    const updateGame = useCallback((gameId, updates) => {
        setAvailableGames(prev =>
            prev.map(g => g.gameId === gameId ? { ...g, ...updates } : g)
        );

        // Also update current game if it matches
        if (currentGame?.gameId === gameId) {
            setCurrentGame(prev => ({ ...prev, ...updates }));
        }
    }, [currentGame]);

    /**
     * Update current game data
     */
    const updateCurrentGame = useCallback((updates) => {
        setCurrentGame(prev => prev ? { ...prev, ...updates } : null);
    }, []);

    const value = {
        currentGame,
        availableGames,
        isInGame,
        joinGameRoom,
        leaveGameRoom,
        updateAvailableGames,
        addGame,
        removeGame,
        updateGame,
        updateCurrentGame
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContext;
