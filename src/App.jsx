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
  const { on } = useSocket();

  const handleLoadingComplete = () => {
    setCurrentPage('welcome');
  };

  const handleStartGame = (name) => {
    setUsername(name);
    setCurrentPage('lobby');
  };

  const handleGameStart = () => {
    setCurrentPage('game');
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
      {currentPage === 'game' && <GamePage username={username} />}
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
