"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FiCopy } from "react-icons/fi";
import styles from '@/components/multiplayer.module.css';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

const MultiplayerTicTacToe = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isWaitingForPlayers, setIsWaitingForPlayers] = useState(false);
  const [gameState, setGameState] = useState({
    board: Array(3).fill().map(() => Array(3).fill(null)),
    currentPlayer: 'X',
    gameSize: 3,
    winner: null,
    isGameOver: false,
    isDraw: false
  });
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameSize, setGameSize] = useState(3);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(socketUrl);
    setSocket(socketRef.current);

    // Socket event listeners
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socketRef.current.on('ticTacToeRoomJoined', (data) => {
      console.log('Joined room:', data);
      console.log('Player symbol received:', data.playerSymbol);
      console.log('Player symbols object:', data.playerSymbols);
      console.log('Type of playerSymbol:', typeof data.playerSymbol);
      console.log('Is playerSymbol null/undefined?', data.playerSymbol === null || data.playerSymbol === undefined);
      console.log('Game size from backend:', data.gameState.gameSize);

      setIsInRoom(true);
      setGameState(data.gameState);
      setGameSize(data.gameState.gameSize); // Sync gameSize with backend

      // Fallback: if no symbol is assigned, assign based on player count
      let assignedSymbol = data.playerSymbol;
      if (!assignedSymbol) {
        if (data.players.length === 1) {
          assignedSymbol = 'X';
        } else if (data.players.length === 2) {
          assignedSymbol = 'O';
        }
        console.log(`Frontend fallback: Assigned symbol ${assignedSymbol} based on player count`);
      }

      setPlayerSymbol(assignedSymbol);
      setPlayers(data.players);

      // Check if we need to wait for more players
      if (data.players.length < 2) {
        setIsWaitingForPlayers(true);
        setIsGameStarted(false);
      } else {
        setIsWaitingForPlayers(false);
        setIsGameStarted(false);
        // Game can start when both players are present
      }
    });

    socketRef.current.on('gameReady', (data) => {
      console.log('Game ready:', data);
      setGameState(data.gameState);
      setGameSize(data.gameState.gameSize); // Sync gameSize with backend
      setPlayers(data.players);
      setIsWaitingForPlayers(false);
      setIsGameStarted(false);
      console.log('Game ready - waiting for start button');
    });

    socketRef.current.on('moveMade', (data) => {
      console.log('Move made:', data);
      setGameState(data.gameState);
    });

    socketRef.current.on('gameReset', (data) => {
      console.log('Game reset:', data);
      console.log('New game size from backend:', data.gameState.gameSize);
      console.log('New board dimensions:', data.gameState.board.length, 'x', data.gameState.board[0]?.length);
      setGameState(data.gameState);
      setGameSize(data.gameState.gameSize); // Update local gameSize to match backend
      setIsGameStarted(false);
    });

    socketRef.current.on('gameStarted', (data) => {
      console.log('Game started:', data);
      console.log('Game state after start:', data.gameState);
      setGameState(data.gameState);
      setGameSize(data.gameState.gameSize); // Sync gameSize with backend
      setIsGameStarted(true);
    });

    socketRef.current.on('invalidMove', (message) => {
      alert(message);
    });

    socketRef.current.on('joinFailed', (message) => {
      alert(message);
    });

    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('usernameSet', (data) => {
      console.log('Username set:', data);
      setIsUsernameSet(true);
    });

    socketRef.current.on('usernameSetError', (message) => {
      console.error('Username set error:', message);
      alert(`Error setting username: ${message}`);
    });

    socketRef.current.on('roomCreatedError', (message) => {
      console.error('Room creation error:', message);
      alert(`Error creating room: ${message}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleSetUsername = () => {
    if (username.trim()) {
      socketRef.current.emit('setUsername', username.trim());
    }
  };

  const handleCreateRoom = () => {
    if (socketRef.current && isUsernameSet) {
      socketRef.current.emit('createRoom', { gameType: 'ticTacToe', gameSize });
      // Set up a one-time listener for roomCreated
      const handleRoomCreated = (data) => {
        console.log('Room created:', data);
        setRoomId(data.roomId);
        // Automatically join the TicTacToe room after creating
        setTimeout(() => {
          socketRef.current.emit('joinTicTacToeRoom', { roomId: data.roomId, gameSize });
        }, 100);
        // Remove the listener after use
        socketRef.current.off('roomCreated', handleRoomCreated);
      };
      socketRef.current.on('roomCreated', handleRoomCreated);
    }
  };

  const handleJoinRoom = () => {
    if (roomId.trim() && socketRef.current && isUsernameSet) {
      socketRef.current.emit('joinTicTacToeRoom', { roomId: roomId.trim(), gameSize });
    }
  };

  const handleCellClick = (row, col) => {
    console.log('Cell clicked:', { row, col, currentPlayer: gameState.currentPlayer, playerSymbol, isGameOver: gameState.isGameOver, cellValue: gameState.board[row][col] });

    if (gameState.isGameOver || gameState.board[row][col] !== null) {
      console.log('Move blocked: game over or cell occupied');
      return;
    }

    if (gameState.currentPlayer !== playerSymbol) {
      console.log('Move blocked: not your turn');
      return;
    }

    console.log('Making move...');
    socketRef.current.emit('makeMove', { roomId, row, col });
  };

  const handleStartGame = () => {
    if (socketRef.current) {
      socketRef.current.emit('startGame', { roomId, gameSize });
    }
  };

  const handleResetGame = () => {
    if (socketRef.current) {
      socketRef.current.emit('resetGame', { roomId, gameSize });
    }
  };

  const handleSizeChange = (newSize) => {
    if (socketRef.current && isInRoom) {
      // Update local state first
      setGameSize(newSize);
      // Reset the game with new size
      socketRef.current.emit('resetGame', { roomId, gameSize: newSize });
      console.log(`Size changed to ${newSize}x${newSize}`);
    } else if (!isInRoom) {
      // If not in room, just update local state
      setGameSize(newSize);
      console.log(`Size changed to ${newSize}x${newSize} (not in room)`);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      socketRef.current.emit('chatMessage', { roomId, message: newMessage.trim() });
      setNewMessage("");
    }
  };

  const getWinLength = (size) => {
    if (size <= 5) return 3;
    if (size <= 7) return 4;
    return 6;
  };

  // Show loading animation while connecting to server
  if (!isConnected) {
    return (
      <div className={styles.connectionStatus}>
        <div className={styles.loadingSpinner}></div>
        <p>Connecting to server...</p>
        <div className={styles.connectionIndicator}>
          <div className={styles.connectionDot}></div>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Establishing connection</span>
        </div>
      </div>
    );
  }

  if (!isUsernameSet) {
    return (
      <div className="username-setup">
        <h2>Welcome to Multiplayer</h2>
        <div className="username-form">
          <div className="username-input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="username-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSetUsername()}
            />
          </div>
          <button onClick={handleSetUsername} className="username-button">
            Continue to Game
          </button>
          <p className="username-hint">Choose a username to play multiplayer games</p>
        </div>
      </div>
    );
  }

  if (!isInRoom) {
    return (
      <div className="room-setup">
        <h2>Multiplayer TicTacToe</h2>
        <div className="room-setup-container">
          <div className="room-options">
            <div className="room-option-card">
              <h3>Create New Room</h3>
              <button onClick={handleCreateRoom} className="create-room-button">
                Create New Room
              </button>
            </div>

            <div className="room-divider">
              <span>OR</span>
            </div>

            <div className="room-option-card">
              <h3>Join Existing Room</h3>
              <div className="join-room-form">
                <div className="input-group">
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter Room ID"
                    className="room-id-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                  />
                </div>
                <button onClick={handleJoinRoom} className="join-room-button">
                  Join Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show waiting for players or start game button
  if (isInRoom && !isGameStarted) {
    console.log('Rendering room setup:', { isWaitingForPlayers, playersLength: players.length, isGameStarted });
    return (
      <div className="room-setup">
        <div className="room-info-container">
          <div className="room-header">
            <h2>Game Room</h2>
            <div className="room-code">
              <span className="room-code-label">Room Code:</span>
              <div className="room-code-value">
                {roomId}
                <button
                  className="copy-code-button"
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    // You could add a toast notification here
                  }}
                  title="Copy room code"
                >
                  <FiCopy />
                </button>
              </div>
            </div>
          </div>

          <div className="room-status">
            <div className="status-item">
              <span className="status-label">Players</span>
              <div className="status-value">
                <span className={`player-count ${players.length === 2 ? 'complete' : ''}`}>
                  {players.length}/2
                </span>
              </div>
            </div>

            <div className="status-item">
              <span className="status-label">Your Symbol</span>
              <div className="status-value">
                <span className="player-symbol-display">
                  {playerSymbol || '...'}
                </span>
              </div>
            </div>
          </div>

          {isWaitingForPlayers ? (
            <div className="waiting-state">
              <div className="loading-spinner"></div>
              <p className="waiting-message">Waiting for opponent to join...</p>
              <p className="share-hint">Share the room code with your friend to start playing!</p>
            </div>
          ) : (
            <div className="ready-state">
              <div className="ready-message">
                <span className="ready-icon">✨</span>
                <p>Both players are ready!</p>
              </div>

              <div className="game-setup">
                <div className="size-selection">
                  <label>Select Board Size</label>
                  <select
                    value={gameSize}
                    onChange={(e) => {
                      const newSize = parseInt(e.target.value);
                      setGameSize(newSize);
                      console.log('Board size changed to:', newSize);
                    }}
                    className="board-size-select"
                  >
                    <option value={3}>3x3</option>
                    <option value={4}>4x4</option>
                    <option value={5}>5x5</option>
                    <option value={6}>6x6</option>
                    <option value={7}>7x7</option>
                    <option value={8}>8x8</option>
                    <option value={9}>9x9</option>
                    <option value={10}>10x10</option>
                  </select>
                </div>

                <button onClick={handleStartGame} className="start-game-button">
                  Start Game
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="multiplayer-game">
      <div className="game-info">
        <div className="flex items-center justify-between">
          <h2>Room: {roomId}</h2>
          {!gameState.isGameOver && (
            <p className="text-lg font-bold text-green-500 font-mono border border-green-500 rounded-md px-2 py-1">Get {getWinLength(gameState.gameSize)} in a row to win {gameSize}x{gameSize} !</p>
          )}
          <div className="game-status">
            <span className="status-indicator active">Game Active</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <p>Your Symbol: {playerSymbol || 'Not assigned'}</p>
          <p className="font-bold">Current Turn: {gameState.currentPlayer}</p>
          {!playerSymbol && <p style={{ color: 'red' }}>⚠️ No symbol assigned! This is a bug.</p>}
          <div className="game-controls">
            <button onClick={handleResetGame} className="reset-button">Reset Game</button>
          </div>
        </div>
      </div>

      <div className="game-board-and-chat">
        <div className="game-board-section">
          <div
            className="dynamic-board"
            style={{
              gridTemplateColumns: `repeat(${gameState.gameSize}, 1fr)`,
              gridTemplateRows: `repeat(${gameState.gameSize}, 1fr)`,
              maxWidth: 'min(50vw, calc(100vh - 400px))',
              maxHeight: 'min(50vw, calc(100vh - 400px))',
              width: 'min(50vw, calc(100vh - 200px))',
              height: 'min(50vw, calc(100vh - 200px))'
            }}
          >
            {console.log('Rendering board with size:', gameState.gameSize, 'Board dimensions:', gameState.board.length, 'x', gameState.board[0]?.length)}
            {gameState.board.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  className={`cell ${cell === playerSymbol ? 'own-move' : ''}`}
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                  disabled={gameState.isGameOver || cell !== null || gameState.currentPlayer !== playerSymbol}
                  title={`Row: ${rowIdx}, Col: ${colIdx}, Current: ${gameState.currentPlayer}, Your: ${playerSymbol}, Disabled: ${gameState.isGameOver || cell !== null || gameState.currentPlayer !== playerSymbol}`}
                >
                  {cell}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="chat-section">
          <h3>Chat</h3>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="chat-message"
                style={{
                  display: "flex",
                  justifyContent: msg.username == username ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.username == username ? 'lightgreen' : 'lightblue'
                }}>
                <strong>{msg.username}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage} className="send-button">
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="game-messages">
        {gameState.winner && (
          <div className="winner-message">
            Player {gameState.winner} wins!
          </div>
        )}
        {gameState.isDraw && (
          <div className="draw-message">
            It's a draw!
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiplayerTicTacToe;
