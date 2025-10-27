# Tic-Tac-Toe Game

A modern, interactive Tic-Tac-Toe game built with Next.js, featuring both single-player and multiplayer modes with real-time gameplay using Socket.io.

## 🌐 Live Demo

**Play the game:** [https://tic-tac-toe-game-fe.onrender.com/](https://tic-tac-toe-game-fe.onrender.com/)

## Backend Repo | Dependency Repository
https://github.com/JRanjan-Biswal/tic-tac-toe-game-be.git

## ✨ Features

- 🎮 **Single Player Mode** - Play against yourself or practice with adjustable difficulty
- 👥 **Multiplayer Mode** - Real-time online gameplay with friends
- 📐 **Customizable Board Sizes** - Play on boards ranging from 3x3 to 10x10
- 🎯 **Adaptive Win Conditions** - Win conditions adjust based on board size:
  - 3-5 boards: Get 3 in a row
  - 6-7 boards: Get 4 in a row
  - 8-10 boards: Get 6 in a row
- 💬 **In-Game Chat** - Real-time chat functionality in multiplayer mode
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔄 **Room System** - Create or join rooms with unique room codes

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Styling framework
- **Socket.io Client** - Real-time communication
- **React Icons** - Icon library
- **date-pack** - Date utilities

### Backend
- [Backend Repository (https://github.com/JRanjan-Biswal/tic-tac-toe-game-be.git)](https://github.com/JRanjan-Biswal/tic-tac-toe-game-be.git)
- **Node.js** - Runtime environment
- **Socket.io** - WebSocket server

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JRanjan-Biswal/tic-tac-toe-game-fe.git
cd tic-tac-toe-game-fe
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SOCKET_URL=your_backend_socket_url
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 How to Play

### Single Player Mode

1. Select "Single Player" mode
2. Choose your board size (3x3 to 10x10)
3. Click "Start Game"
4. Alternate between X and O to play
5. First to get the required number in a row wins!

### Multiplayer Mode

1. Select "Multiplayer" mode
2. Enter your username
3. Either create a new room or join an existing one using a room code
4. Share the room code with your friend
5. Once both players join, select board size and start the game
6. Take turns making moves in real-time
7. Use the chat feature to communicate with your opponent

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Main page
│   ├── globals.css        # Global styles
│   └── favicon.ico
├── components/
│   ├── Board.js           # Game board component
│   ├── TicTacToe.js       # Single player mode
│   ├── MultiplayerTicTacToe.js  # Multiplayer mode
│   ├── Gameroom.js        # Game room logic
│   ├── Header/            # Header component
│   ├── Footer/            # Footer component
│   └── Layout/            # Layout wrapper
├── hooks/
│   ├── useWindowWidth.js  # Window width hook
│   └── useWindowAvailable.js
└── public/                # Static assets
```

## 🎨 Key Features Explained

### Board Size Logic
The win condition adapts based on the board size:
- **Small boards (3-5)**: Win by getting 3 in a row
- **Medium boards (6-7)**: Win by getting 4 in a row  
- **Large boards (8-10)**: Win by getting 6 in a row

This ensures balanced gameplay regardless of board size.

### Multiplayer Architecture
- Socket.io enables real-time bidirectional communication
- Room-based system for multiplayer sessions
- Automatic player symbol assignment (X/O)
- Turn-based gameplay with server-side validation
- Real-time chat for player communication

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Environment Variables

Make sure to set up the following environment variable:

- `NEXT_PUBLIC_SOCKET_URL` - Your Socket.io server URL

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**JRanjan Biswal**

## 🔗 Related Links

- **Live Demo**: [https://tic-tac-toe-game-fe.onrender.com/](https://tic-tac-toe-game-fe.onrender.com/)
- **Backend Repository**: [https://github.com/JRanjan-Biswal/tic-tac-toe-game-be](https://github.com/JRanjan-Biswal/tic-tac-toe-game-be)
