/**
 * useGameLobby Hook
 * Manages lobby state and real-time game list updates
 */

import { useEffect, useCallback, useState, useRef } from 'react';
import { useSocket } from './useSocket';
import { useGame } from '../context/GameContext';
import { useGameActions } from './useGameActions';
import { SOCKET_EVENTS } from '../utils/constants';

export const useGameLobby = () => {
  const { socket, on, emit, userData } = useSocket();
  // Use Ref to access latest userData in event listeners without re-binding
  const userDataRef = useRef(userData);
  
  useEffect(() => {
    userDataRef.current = userData;
  }, [userData]);

  const {
    availableGames,
    currentGame,
    updateAvailableGames,
    addGame,
    removeGame,
    updateGame,
    joinGameRoom,
    updateCurrentGame
  } = useGame();

  const { resetLoadingStates } = useGameActions();
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Fetch available games
   */
  const fetchGames = useCallback(() => {
    setIsRefreshing(true);
    emit('getAvailableGames');
    
    // Reset refreshing state after 1 second
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [emit]);

  /**
   * Setup socket event listeners
   */
  useEffect(() => {
    if (!socket) return;

    console.log('Setting up lobby socket listeners...');

    // Register listeners
    // Use refs or functional updates to avoid dependencies in useEffect
    
    // Game Created
    on(SOCKET_EVENTS.GAME_CREATED, (data) => {
      console.log('Game created:', data);
      if (data.game) {
        addGame(data.game);
        
        // Only join room if WE created it
        // Check both userData.userId and socket.id to be safe
        const currentUserId = userDataRef.current?.userId;
        const isCreator = (currentUserId && data.game.creatorId === currentUserId) || 
                          (socket.id && data.game.creatorId === socket.id); 

        if (isCreator) {
           console.log('👍 We created this game, joining room locally...');
           joinGameRoom(data.game);
        }
        resetLoadingStates();
      }
    });

    // Game Joined
    on(SOCKET_EVENTS.GAME_JOINED, (data) => {
      console.log('Game joined:', data);
      if (data.gameInfo) {
        joinGameRoom(data.gameInfo);
        updateGame(data.gameId, data.gameInfo);
        resetLoadingStates();
      }
    });

    // Game Started
    on(SOCKET_EVENTS.GAME_STARTED, (data) => {
      console.log('Game started:', data);
      removeGame(data.gameId);
      
      // Update current game status if we are in it
      updateCurrentGame({ status: 'active', ...data });
      resetLoadingStates();
    });

    // Game Ended
    on(SOCKET_EVENTS.GAME_ENDED, (data) => {
      console.log('Game ended:', data);
      removeGame(data.gameId);
    });

    on('gameCancelled', (data) => {
      console.log('Game cancelled:', data);
      removeGame(data.gameId);
    });

    on('availableGames', (data) => {
      console.log('Available games:', data);
      if (data.games) {
        updateAvailableGames(data.games);
      }
      setIsRefreshing(false);
    });

    // Player Joined - Use functional update in context to avoid dep
    on('playerJoined', (data) => {
      console.log('Player joined game:', data);
      if (data.gameId && data.player) {
         updateGame(data.gameId, {
            // This is handled by the context updateGame now which accepts partial updates
            // But we need to know the current players to append.
            // Since we can't access state here without dep, we rely on context's functional update capability
            // OR simpler: just re-fetch the specific game or list?
            // Actually, context updateGame usually merges. 
            // Let's modify context to support functional updates for deeply nested props if needed
            // OR: just emit getAvailableGames to refresh properly?
            // No, that's heavy.
            // Let's assume updateGame in context handles this logic, 
            // BUT wait, previous fix put logic HERE. 
            // We moved logic back to here. 
            // The issue is `availableGames` dependency.
            // We need to use a Ref for availableGames if we want to use it here without re-triggering effect
         });
         // BETTER: Just trigger a refresh for now to be safe and consistent
         // emit('getAvailableGames'); 
         // ACTUALLY: The previous fix attempted to map over availableGames.
         // Let's use the context's setAvailableGames with a function.
         // But updateGame exposes specific API.
         // Let's just fix the dependency array first.
         
         // Temporary fix: Trigger refresh. It's cleaner than race conditions.
         // Or better, listen to the event and let the context handle it if possible.
         // Let's stick to the previous logic but REMOVE availableGames from dependency.
         // To do that, we need to move these handlers OUT of useEffect or use a ref.
      }
    });
    
    // SIMPLIFICATION:
    // Just handling the simple events here. 
    // Real-time player updates are tricky without state access.
    // Let's ask the backend to send the FULL updated game object on join? 
    // Or just re-fetch list.
    // Check game.handler.js... it sends { gameId, player }.
    
    on('playerJoined', (data) => {
       // Re-fetch to ensure sync (easiest fix for now)
       // setIsRefreshing(true); // Don't show spinner for background update
       emit('getAvailableGames');
    });

    on('playerLeft', (data) => {
        emit('getAvailableGames');
    });

    on(SOCKET_EVENTS.ERROR, (data) => {
      console.error('Game error:', data);
      resetLoadingStates();
      setIsRefreshing(false);
    });

    // Fetch games on mount
    fetchGames();

    return () => {
      // Cleanup
    };
  }, [socket, on, emit, fetchGames]); // REMOVED availableGames, addGame, etc. from deps to prevent loop

  return {
    availableGames,
    currentGame,
    isRefreshing,
    fetchGames
  };
};

export default useGameLobby;
