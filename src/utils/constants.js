/**
 * Game Constants
 * Centralized configuration for the game
 */

// Socket Events
export const SOCKET_EVENTS = {
  // Connection
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  
  // User
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  USER_COUNT: 'userCount',
  
  // Game
  CREATE_GAME: 'createGame',
  GAME_CREATED: 'gameCreated',
  JOIN_GAME: 'joinGame',
  GAME_JOINED: 'gameJoined',
  START_GAME: 'startGame',
  GAME_STARTED: 'gameStarted',
  GAME_ENDED: 'gameEnded',
  
  // Tiles
  CLAIM_TILE: 'claimTile',
  TILE_CLAIMED: 'tileClaimed',
  BATCH_UPDATE: 'batchUpdate',
  GET_TILES: 'getTiles',
  TILES_DATA: 'tilesData',
  
  // Leaderboard
  GET_LEADERBOARD: 'getLeaderboard',
  LEADERBOARD_UPDATE: 'leaderboardUpdate',
  SCORE_UPDATE: 'scoreUpdate',
  
  // General
  ERROR: 'error'
};

// Grid Configuration
export const GRID_CONFIG = {
  WIDTH: parseInt(import.meta.env.VITE_GRID_WIDTH) || 20,
  HEIGHT: parseInt(import.meta.env.VITE_GRID_HEIGHT) || 25,
  get TOTAL_TILES() {
    return this.WIDTH * this.HEIGHT;
  }
};

// Game Configuration
export const GAME_CONFIG = {
  DURATION: parseInt(import.meta.env.VITE_GAME_DURATION) || 300000, // 5 minutes
  BATCH_UPDATE_INTERVAL: 100, // 100ms
  LEADERBOARD_REFRESH_INTERVAL: 5000 // 5 seconds
};

// Tile Status
export const TILE_STATUS = {
  UNCLAIMED: 'unclaimed',
  CLAIMED: 'claimed'
};

// Game States
export const GAME_STATES = {
  WAITING: 'waiting',
  ACTIVE: 'active',
  ENDED: 'ended'
};

// Color Palette (for reference)
export const COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#4caf50',
  ERROR: '#f44336',
  WARNING: '#ffc107',
  INFO: '#2196F3'
};

export default {
  SOCKET_EVENTS,
  GRID_CONFIG,
  GAME_CONFIG,
  TILE_STATUS,
  GAME_STATES,
  COLORS
};
