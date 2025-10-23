'use client';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Connect to your Socket.IO server
const socket = io('http://localhost:4000');

const Gameroom = () => {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const [gameType, setGameType] = useState('chess');
    const [currentRoom, setCurrentRoom] = useState(null);
    const [players, setPlayers] = useState([]);
    const [status, setStatus] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');

    useEffect(() => {
        // --- Socket.IO Event Handlers ---
        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
            setCurrentRoom(null);
            setPlayers([]);
        });

        socket.on('roomCreated', (data) => {
            console.log('Joined room:', data);
            setCurrentRoom(data.roomId);
            setPlayers(data.players);
            setStatus(`Room created! Share this ID: ${data.roomId}`);
        });

        socket.on('roomJoined', (data) => {
            setCurrentRoom(data.roomId);
            setPlayers(data.players);
            setStatus(`Successfully joined room: ${data.roomId}`);
        });

        socket.on('playerJoined', (data) => {
            setPlayers(data.players);
            setStatus('A new player has joined!');
        });

        socket.on('playerLeft', (data) => {
            setPlayers(data.players);
            setStatus('A player has left the room.');
        });

        socket.on('joinFailed', (message) => {
            setStatus(message);
        });

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up event listeners when the component unmounts
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('roomCreated');
            socket.off('roomJoined');
            socket.off('playerJoined');
            socket.off('playerLeft');
            socket.off('joinFailed');
            socket.off('message');
        };
    }, []);

    const handleSetUsername = () => {
        console.log('Setting username to:', username);
        if (username) {
            socket.emit('setUsername', username);
            setStatus(`Username set to: ${username}`);
        } else {
            setStatus('Please enter a username.');
        }
    };

    const handleCreateRoom = () => {
        if (username) {
            socket.emit('createRoom', { gameType });
        } else {
            setStatus('Please set a username first.');
        }
    };

    const handleJoinRoom = () => {
        if (username && roomId) {
            socket.emit('joinRoom', { roomId });
        } else {
            setStatus('Please enter a username and a room ID.');
        }
    };

    const handleLeaveRoom = () => {
        // This event should be handled on the server
        // For now, we'll just reset the UI state
        socket.emit('leaveRoom', { roomId: currentRoom });
        setCurrentRoom(null);
        setPlayers([]);
        setStatus('You have left the room.');
    };

    // New function to send a message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (currentMessage.trim() && currentRoom) {
            socket.emit('chatMessage', { roomId: currentRoom, message: currentMessage });
            setCurrentMessage('');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Gameroom</h1>

            {!currentRoom ? (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <h2>Set Your Username</h2>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        // disabled={!!username}
                        />
                        <button onClick={handleSetUsername}>Set Username</button>
                    </div>

                    <hr />

                    <div style={{ marginBottom: '20px' }}>
                        <h2>Create a Room</h2>
                        <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
                            <option value="chess">Chess</option>
                            <option value="checkers">Checkers</option>
                        </select>
                        <button onClick={handleCreateRoom} className='cursor-pointer'>Create Room</button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h2>Join a Room</h2>
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter Room ID"
                        />
                        <button onClick={handleJoinRoom}>Join Room</button>
                    </div>
                </>
            ) : (
                <div style={{ border: '1px solid #ccc', padding: '15px' }}>
                    <h2>Room Details</h2>
                    <p><strong>Room ID:</strong> {currentRoom}</p>
                    <p><strong>Game Type:</strong> {gameType}</p>
                    <h3>Players</h3>
                    <ul>
                        {players?.map((p, index) => (
                            <li key={index}>{p.username}</li>
                        ))}
                    </ul>
                    <button onClick={handleLeaveRoom}>Leave Room</button>
                </div>
            )}

            <hr />
            <p style={{ fontWeight: 'bold' }}>Status: {status}</p>
            <p>Connection: {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>

            <hr />

            <h4>Room Chat</h4>
            <div style={{ height: '200px', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px' }}>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.username}:</strong> {msg.text}
                    </p>
                ))}
            </div>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', marginTop: '10px' }}>
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, marginRight: '10px' }}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Gameroom;