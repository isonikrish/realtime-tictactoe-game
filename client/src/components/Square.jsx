import React, { useState } from 'react';
import { FaTimes, FaRegCircle } from 'react-icons/fa';

function Square({ value, setGameState, currentPlayer, setCurrentPlayer, finished, isWinningSquare, socket, gameState,currenElement }) {
  const [icon, setIcon] = useState(null);
  const cross = <FaTimes />;
  const circle = <FaRegCircle />;

  const clickonSquare = () => {
    if (!icon && !finished) {
      setIcon(currentPlayer === 'circle' ? circle : cross);

      const mycurrentplayer = currentPlayer;

      // Emit move to server
      socket.emit('player-move-from-client', { state: { id: value, currentplayer: mycurrentplayer } });

      // Switch player locally
      setCurrentPlayer(currentPlayer === 'circle' ? 'cross' : 'circle');

      // Update game state locally
      setGameState((prev) => {
        let newState = [...prev];
        const row = Math.floor(value / 3);
        const col = value % 3;
        newState[row][col] = mycurrentplayer;
        return newState;
      });
    }
  };

  return (
    <div
      className={`bg-[#4B495F] w-[100px] h-[100px] rounded-md ${finished ? 'cursor-not-allowed' : 'cursor-pointer'} 
      flex justify-center items-center text-4xl text-white ${icon === null ? 'hover:bg-[#636177]' : 'bg-[#636177]'} 
      ${isWinningSquare ? 'highlight' : ''}`}
      onClick={clickonSquare}
    >
      {currenElement === "circle" ? circle : currenElement === "cross" ? cross : icon}
    </div>
  );
}

export default Square;
