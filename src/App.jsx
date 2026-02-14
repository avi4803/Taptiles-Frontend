import React, { useState, useEffect } from 'react';
import { SocketProvider } from './context/SocketContext';
import { GameProvider } from './context/GameContext';
import { useSocket } from './hooks/useSocket';
import LoadingPage from './pages/LoadingPage';
import WelcomePage from './pages/WelcomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';

// Inner component that uses socket context
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('loading');
  const [username, setUsername] = useState('');
  const { on, connect } = useSocket();
  // Restore state on load
  useEffect(() => {
    const savedState = localStorage.getItem('tapTileState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.username) {
          setUsername(parsed.username);
          // Auto-connect socket with restored username
          connect(parsed.username);
        }
        // Don't auto-restore page to 'game' without verifying, but 'lobby' is safe
        if (parsed.currentPage && parsed.currentPage !== 'loading') {
          setCurrentPage(parsed.currentPage === 'game' ? 'lobby' : parsed.currentPage);
        }
      } catch (e) {
        console.error('Failed to parse saved state');
      }
    }
  }, [connect]);

  // Save state
  useEffect(() => {
    if (currentPage !== 'loading' && currentPage !== 'welcome') {
      localStorage.setItem('tapTileState', JSON.stringify({ currentPage, username }));
    }
  }, [currentPage, username]);

  const handleLoadingComplete = () => {
    // If we restored state, we might not want to go to welcome?
    // If currentPage was set by restore effect, it might be 'lobby'.
    // But 'loading' comp logic might override?
    // LoadingPage calls onComplete.
    // If we are already at 'lobby' (due to restore), we stick to it?
    // Let's check: LoadingPage likely runs for X seconds then calls onComplete.
    // If we set currentPage to 'lobby' in useEffect, LoadingPage is unmounted immediately?
    // Yes, because {currentPage === 'loading' ...}
    // So restore effect unmounts LoadingPage.
    if (currentPage === 'loading') {
      setCurrentPage('welcome');
    }
  };

  const handleStartGame = (name) => {
    setUsername(name);
    connect(name); // Ensure we connect here too if not already
    setCurrentPage('lobby');
  };

  const handleGameStart = () => {
    setCurrentPage('game');
  };

  const handleExitGame = () => {
    setCurrentPage('lobby');
  };

  // Listen for game started event
  useEffect(() => {
    if (!on) return;

    const cleanup = on('gameStarted', (data) => {
      console.log('Game started, navigating to game page:', data);
      setCurrentPage('game');
    });

    return cleanup;
  }, [on]);

  return (
    <div className="dark h-screen overflow-hidden">
      {currentPage === 'loading' && <LoadingPage onComplete={handleLoadingComplete} />}
      {currentPage === 'welcome' && <WelcomePage onStart={handleStartGame} />}
      {currentPage === 'lobby' && <LobbyPage onGameStart={handleGameStart} />}
      {currentPage === 'game' && <GamePage username={username} onExit={handleExitGame} />}
    </div>
  );
};

function App() {
  return (
    <SocketProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </SocketProvider>
  );
}

export default App;
