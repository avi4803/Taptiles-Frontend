/**
 * Socket Context
 * Provides socket instance and connection state to all components
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socketManager from '../utils/socket';

// Create context
const SocketContext = createContext(null);

// Custom hook to use socket context
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

// Socket Provider Component
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(0);

    /**
     * Connect to socket server
     * @param {string} username - User's username
     * @param {string} [userId] - Optional user ID for session restoration
     */
    const connect = useCallback((username, userId) => {
        if (!username || username.trim() === '') {
            setConnectionError('Username is required');
            return;
        }

        try {
            setConnectionError(null);
            const socketInstance = socketManager.connect(username, userId);
            setSocket(socketInstance);

            // Setup event listeners
            setupEventListeners(socketInstance);
        } catch (error) {
            console.error('Failed to connect:', error);
            setConnectionError(error.message);
        }
    }, []);

    /**
     * Disconnect from socket server
     */
    const disconnect = useCallback(() => {
        socketManager.disconnect();
        setSocket(null);
        setIsConnected(false);
        setUserData(null);
        setOnlineUsers(0);
    }, []);

    /**
     * Setup socket event listeners
     */
    const setupEventListeners = (socketInstance) => {
        // Connection events
        socketInstance.on('connect', () => {
            console.log('✅ Connected to server');
            setIsConnected(true);
            setConnectionError(null);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('❌ Connection error:', error.message);
            setIsConnected(false);
            setConnectionError(error.message);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('🔌 Disconnected:', reason);
            setIsConnected(false);
        });

        // User events
        socketInstance.on('userJoined', (data) => {
            console.log('👋 User joined:', data);
            if (data.message) {
                // This is the current user
                setUserData({
                    userId: data.userId,
                    username: data.username,
                    color: data.color
                });
            }
        });

        socketInstance.on('userLeft', (data) => {
            console.log('👋 User left:', data);
        });

        socketInstance.on('userCount', (count) => {
            console.log('👥 Online users:', count);
            setOnlineUsers(count);
        });

        // Error events
        socketInstance.on('error', (data) => {
            console.error('❌ Server error:', data.message);
            setConnectionError(data.message);
        });
    };

    /**
     * Emit event to server
     */
    const emit = useCallback((event, data) => {
        if (socket?.connected) {
            socket.emit(event, data);
        } else {
            console.warn('⚠️ Socket not connected. Cannot emit:', event);
        }
    }, [socket]);

    /**
     * Listen to event from server
     */
    const on = useCallback((event, callback) => {
        if (socket) {
            socket.on(event, callback);

            // Return cleanup function
            return () => {
                socket.off(event, callback);
            };
        }
    }, [socket]);

    /**
     * Remove event listener
     */
    const off = useCallback((event, callback) => {
        if (socket) {
            socket.off(event, callback);
        }
    }, [socket]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    const value = {
        socket,
        isConnected,
        connectionError,
        userData,
        onlineUsers,
        connect,
        disconnect,
        emit,
        on,
        off
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
