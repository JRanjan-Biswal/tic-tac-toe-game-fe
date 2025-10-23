'use client';
import React, { useState } from 'react';
// import Gameroom from '@/components/Gameroom';
import TicTacToe from '@/components/TicTacToe';
import MultiplayerTicTacToe from '@/components/MultiplayerTicTacToe';

function App() {
  const [gameMode, setGameMode] = useState('single'); // 'single' or 'multiplayer'

  return (
    <div className="app-container">
      <div className="game-wrapper">
        {gameMode === 'single' ? (
          <TicTacToe 
            size={3} 
            gameMode={gameMode}
            onGameModeChange={setGameMode}
          />
        ) : (
          <MultiplayerTicTacToe 
            gameMode={gameMode}
            onGameModeChange={setGameMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;