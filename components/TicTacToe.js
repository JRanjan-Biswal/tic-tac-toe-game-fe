"use client";
import { useState, useMemo, useEffect } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { FaArrowLeftLong } from "react-icons/fa6";

const createGrid = (size) =>
  Array(size)
    .fill()
    .map(() => Array(size).fill(null));

const PLAYERS = {
  X: (
    <svg viewBox="0 0 24 24" className="player-symbol x-symbol">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  ),
  O: (
    <svg viewBox="0 0 24 24" className="player-symbol o-symbol">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
    </svg>
  )
};

// Get required win length based on board size
const getWinLength = (size) => {
  if (size <= 5) return 3;
  if (size <= 7) return 4;
  return 6; // for size 8-10
};

const checkWinner = (board, size) => {
  // Safety check: ensure board exists and has correct dimensions
  if (!board || !Array.isArray(board) || board.length !== size) {
    return null;
  }

  const winLength = getWinLength(size);

  // Check rows
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - winLength; j++) {
      const first = board[i][j];
      if (!first) continue;

      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (board[i][j + k] !== first) {
          win = false;
          break;
        }
      }
      if (win) return first;
    }
  }

  // Check columns
  for (let j = 0; j < size; j++) {
    for (let i = 0; i <= size - winLength; i++) {
      const first = board[i][j];
      if (!first) continue;

      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (board[i + k][j] !== first) {
          win = false;
          break;
        }
      }
      if (win) return first;
    }
  }

  // Check main diagonal (top-left to bottom-right)
  for (let i = 0; i <= size - winLength; i++) {
    for (let j = 0; j <= size - winLength; j++) {
      const first = board[i][j];
      if (!first) continue;

      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (board[i + k][j + k] !== first) {
          win = false;
          break;
        }
      }
      if (win) return first;
    }
  }

  // Check anti-diagonal (top-right to bottom-left)
  for (let i = 0; i <= size - winLength; i++) {
    for (let j = winLength - 1; j < size; j++) {
      const first = board[i][j];
      if (!first) continue;

      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (board[i + k][j - k] !== first) {
          win = false;
          break;
        }
      }
      if (win) return first;
    }
  }

  return null;
};

const checkDraw = (board) =>
  board.every((row) => row.every((cell) => cell !== null));

export default function TicTacToe({ size = 3, gameMode, onGameModeChange }) {
  const [gameSize, setGameSize] = useState(size);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Validate size to be between 3 and 10
  const validSize = Math.max(3, Math.min(10, gameSize));

  const [board, setBoard] = useState(() => createGrid(validSize));
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const gameState = useMemo(() => {
    const winner = checkWinner(board, validSize);
    const isDraw = !winner && checkDraw(board);
    return { winner, isDraw, isGameOver: winner || isDraw };
  }, [board, validSize]);

  const handleCellClick = (row, col) => {
    if (board[row][col] || gameState.isGameOver) return;

    setBoard((prev) => {
      const newBoard = prev.map((r) => [...r]);
      newBoard[row][col] = currentPlayer;
      return newBoard;
    });

    setCurrentPlayer((prev) => (prev === 'X' ? 'O' : 'X'));
  };

  const startGame = () => {
    setIsGameStarted(true);
    setBoard(createGrid(validSize));
    setCurrentPlayer('X');
  };

  const resetGame = () => {
    setBoard(createGrid(validSize));
    setCurrentPlayer('X');
  };

  const exitGame = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    setIsGameStarted(false);
    setBoard(createGrid(validSize));
    setCurrentPlayer('X');
    setShowExitConfirm(false);
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value) || 3;
    setGameSize(newSize);
    if (isGameStarted) {
      setIsGameStarted(false);
    }
  };

  // Update board when size changes
  useEffect(() => {
    if (!isGameStarted) {
      setBoard(createGrid(validSize));
      setCurrentPlayer('X');
    }
  }, [validSize, isGameStarted]);

  return (
    <div className="game-container">
      <div className="game-inner">
        <div className="game-header">
          {!isGameStarted ? (
            <div className="game-settings">
              <div className="mode-buttons">
                <button
                  className={`mode-button ${gameMode === 'single' ? 'active' : ''}`}
                  onClick={() => onGameModeChange('single')}
                >
                  <span className="button-text">Single Player</span>
                </button>
                <button
                  className={`mode-button ${gameMode === 'multiplayer' ? 'active' : ''}`}
                  onClick={() => onGameModeChange('multiplayer')}
                >
                  <span className="button-text">Multiplayer</span>
                </button>
              </div>

              <div className="settings-divider"></div>

              <div className="size-input-group">
                <label htmlFor="board-size">Board Size</label>
                <div className="input-wrapper">
                  <button
                    className="size-control decrease"
                    onClick={() => handleSizeChange({ target: { value: Math.max(3, gameSize - 1) } })}
                    disabled={gameSize <= 3}
                    aria-label="Decrease size"
                  >
                    <FiMinus />
                  </button>
                  <input
                    id="board-size"
                    type="number"
                    min="3"
                    max="10"
                    value={gameSize}
                    onChange={handleSizeChange}
                    className="size-input"
                  />
                  <button
                    className="size-control increase"
                    onClick={() => handleSizeChange({ target: { value: Math.min(10, gameSize + 1) } })}
                    disabled={gameSize >= 10}
                    aria-label="Increase size"
                  >
                    <FiPlus />
                  </button>
                </div>
                <span className="input-hint">(3-10)</span>
              </div>

              <button
                className="start-game-button"
                onClick={startGame}
              >
                <span className="button-text">Start Game</span>
              </button>
            </div>
          ) : (
            <div className="game-info">
              <button className="back-button" onClick={exitGame} aria-label="Back to settings">
                <FaArrowLeftLong size={14} />
              </button>
              <div className="game-mode-info">
                <span className="info-label">Mode:</span>
                <span className="info-value">{gameMode === 'single' ? 'Single Player' : 'Multiplayer'}</span>
                <span className="info-separator">•</span>
                <span className="info-label">Board Size:</span>
                <span className="info-value">{gameSize}x{gameSize}</span>
              </div>
            </div>
          )}
        </div>

        {isGameStarted && !gameState.isGameOver && (
          <div className="game-status">
            <button className="reset-game-button" onClick={resetGame} aria-label="Reset game">
              Reset
            </button>
            <div className="current-player">
              <span className="status-label">Current Player:</span>
              <div className="player-indicator">
                {PLAYERS[currentPlayer]}
              </div>
            </div>
            <div className="win-condition">
              Get {getWinLength(validSize)} in a row to win!
            </div>
          </div>
        )}

        {isGameStarted && (
          <div className="game-board-wrapper">
            <div
              className="dynamic-board"
              style={{
                gridTemplateColumns: `repeat(${validSize}, minmax(60px, 80px))`,
                gap: validSize > 5 ? '0.5rem' : '0.75rem'
              }}
            >
              {board.map((row, rowIdx) =>
                row.map((cell, colIdx) => (
                    <button
                      key={`${rowIdx}-${colIdx}`}
                      className={`cell ${cell ? 'filled' : ''}`}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                      disabled={gameState.isGameOver || cell !== null}
                    >
                      <div className="cell-content">
                        {cell ? PLAYERS[cell] : (
                          <div className="cell-preview">
                            {PLAYERS[currentPlayer]}
                          </div>
                        )}
                      </div>
                    </button>
                ))
              )}
            </div>
          </div>
        )}

        {isGameStarted && gameState.isGameOver && (
          <div className="result-overlay">
            <div className="result-modal">
              {gameState.winner ? (
                <div className="winner-message">
                  <div className="result-title">Winner!</div>
                  <div className="winner-symbol">
                    {PLAYERS[gameState.winner]}
                  </div>
                  <div className="confetti-animation"></div>
                </div>
              ) : (
                <div className="draw-message">
                  <div className="result-title">Draw!</div>
                  <div className="result-subtitle">Well played both!</div>
                </div>
              )}
              <div className="result-buttons">
                <button className="back-to-settings-button" onClick={() => {
                  setIsGameStarted(false);
                  setBoard(createGrid(validSize));
                  setCurrentPlayer('X');
                }}>
                  Back to Settings
                </button>
                <button className="play-again-button" onClick={resetGame}>
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showExitConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>End Game?</h2>
            <p>Are you sure you want to end the current game? All progress will be lost.</p>
            <div className="modal-buttons">
              <button className="modal-button cancel" onClick={cancelExit}>
                Cancel
              </button>
              <button className="modal-button confirm" onClick={confirmExit}>
                End Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}