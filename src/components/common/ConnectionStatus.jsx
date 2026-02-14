/**
 * Connection Status Component
 * Displays socket connection status in the UI
 */

import React from 'react';
import { useSocket } from '../../hooks/useSocket';

const ConnectionStatus = () => {
    const { isConnected, connectionError, userData, onlineUsers } = useSocket();

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className={`
        px-4 py-2 rounded-lg shadow-lg backdrop-blur-md
        ${isConnected
                    ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                    : 'bg-red-500/20 border border-red-500/50 text-red-300'
                }
      `}>
                <div className="flex items-center gap-2">
                    <div className={`
            w-2 h-2 rounded-full
            ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}
          `} />
                    <span className="text-sm font-medium">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>

                {isConnected && userData && (
                    <div className="mt-1 text-xs opacity-80">
                        <div>User: {userData.username}</div>
                        <div>Online: {onlineUsers}</div>
                    </div>
                )}

                {connectionError && (
                    <div className="mt-1 text-xs text-red-300">
                        Error: {connectionError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConnectionStatus;
