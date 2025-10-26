"use client";

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

const Board = ({ board, validSize, currentPlayer, gameState, onCellClick }) => {
  return (
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
            onClick={() => onCellClick(rowIdx, colIdx)}
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
  );
};

export default Board;
export { PLAYERS };

