/**
 * useGameActions Hook
 * Handles game CRUD operations (Create, Join, Start, Leave)
 */

import { useState, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useGame } from '../context/GameContext';
import { SOCKET_EVENTS } from '../utils/constants';

export const useGameActions = () => {
  const { emit } = useSocket();
  const { joinGameRoom, leaveGameRoom } = useGame();

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new game
   * @param {Object} config - Game configuration
   * @param {number} config.gridSize - Size of the grid
   * @param {number|null} config.maxPlayers - Maximum players (null for infinite)
   */
  const createGame = useCallback(async (config) => {
    try {
      setIsCreating(true);
      setError(null);

      console.log('Creating game with config:', config);
      
      emit(SOCKET_EVENTS.CREATE_GAME, config);

      // The response will be handled by the socket listener
      // in useGameLobby hook
    } catch (err) {
      console.error('Error creating game:', err);
      setError(err.message || 'Failed to create game');
      setIsCreating(false);
    }
  }, [emit]);

  /**
   * Join an existing game
   * @param {string} gameId - Game ID to join
   */
  const joinGame = useCallback(async (gameId) => {
    try {
      setIsJoining(true);
      setError(null);

      console.log('Joining game:', gameId);

      emit(SOCKET_EVENTS.JOIN_GAME, { gameId });

      // The response will be handled by the socket listener
    } catch (err) {
      console.error('Error joining game:', err);
      setError(err.message || 'Failed to join game');
      setIsJoining(false);
    }
  }, [emit]);

  /**
   * Start a game (creator only)
   * @param {string} gameId - Game ID to start
   */
  const startGame = useCallback(async (gameId) => {
    try {
      setIsStarting(true);
      setError(null);

      console.log('Starting game:', gameId);

      emit(SOCKET_EVENTS.START_GAME, { gameId });

      // The response will be handled by the socket listener
    } catch (err) {
      console.error('Error starting game:', err);
      setError(err.message || 'Failed to start game');
      setIsStarting(false);
    }
  }, [emit]);

  /**
   * Leave current game
   * @param {string} gameId - Game ID to leave
   */
  const leaveGame = useCallback(async (gameId) => {
    try {
      setError(null);

      console.log('Leaving game:', gameId);

      emit('leaveGame', { gameId });
      leaveGameRoom();
    } catch (err) {
      console.error('Error leaving game:', err);
      setError(err.message || 'Failed to leave game');
    }
  }, [emit, leaveGameRoom]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset loading states
   */
  const resetLoadingStates = useCallback(() => {
    setIsCreating(false);
    setIsJoining(false);
    setIsStarting(false);
  }, []);

  return {
    createGame,
    joinGame,
    startGame,
    leaveGame,
    isCreating,
    isJoining,
    isStarting,
    error,
    clearError,
    resetLoadingStates
  };
};

export default useGameActions;
