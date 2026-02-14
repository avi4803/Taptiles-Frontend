import React, { useState } from 'react';
import { SocketProvider } from './context/SocketContext';
import LoadingPage from './pages/LoadingPage';
import WelcomePage from './pages/WelcomePage';
import GamePage from './pages/GamePage';

function App() {
  const [currentPage, setCurrentPage] = useState('loading');
  const [username, setUsername] = useState('');

  const handleLoadingComplete = () => {
    setCurrentPage('welcome');
  };

  const handleStartGame = (name) => {
    setUsername(name);
    setCurrentPage('game');
  };

  return (
    <SocketProvider>
      <div className="dark h-screen overflow-hidden">
        {currentPage === 'loading' && <LoadingPage onComplete={handleLoadingComplete} />}
        {currentPage === 'welcome' && <WelcomePage onStart={handleStartGame} />}
        {currentPage === 'game' && <GamePage username={username} />}
      </div>
    </SocketProvider>
  );
}

export default App;
