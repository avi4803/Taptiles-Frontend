/**
 * Socket.IO Client Manager
 * Singleton pattern to ensure only one socket connection
 */

import { io } from 'socket.io-client';

// Backend server URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnecting = false;
  }

  /**
   * Initialize socket connection with username
   * @param {string} username - User's username
   * @returns {Socket} Socket instance
   */
  connect(username, userId) {
    // Prevent multiple connections
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    if (this.isConnecting) {
      console.log('Connection already in progress');
      return this.socket;
    }

    this.isConnecting = true;

    console.log('🔌 Connecting to socket server...', SOCKET_URL);

    // Create socket connection with authentication
    this.socket = io(SOCKET_URL, {
      auth: {
        username: username,
        userId: userId
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      this.isConnecting = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      this.isConnecting = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Reconnection attempt:', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error.message);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed');
    });

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  /**
   * Get current socket instance
   * @returns {Socket|null} Socket instance or null
   */
  getSocket() {
    return this.socket;
  }

  /**
   * Check if socket is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Emit event to server
   * @param {string} event - Event name
   * @param {*} data - Data to send
   */
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected. Cannot emit:', event);
    }
  }

  /**
   * Listen to event from server
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

// Export singleton instance
const socketManager = new SocketManager();
export default socketManager;
