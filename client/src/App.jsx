import React, { useState, useEffect } from 'react';
import './App.css';
import Square from './components/Square';
import io from 'socket.io-client';
import Swal from "sweetalert2";
function App() {

  const renderSquare = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];
  const [winningLine, setWinningLine] = useState(null);
  const [gameState, setGameState] = useState(renderSquare);
  const [currentPlayer, setCurrentPlayer] = useState('circle');
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState(null);
  const [playOnline, setPlayOnline] = useState(false)
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [playingAs, setPlayingAs] = useState("");

  const checkwinner = () => {
    // Horizontal check
    for (let row = 0; row < gameState.length; row++) {
      if (gameState[row][0] === gameState[row][1] && gameState[row][1] === gameState[row][2]) {
        return { winner: gameState[row][0], line: [[row, 0], [row, 1], [row, 2]] };
      }
    }

    // Vertical check
    for (let col = 0; col < gameState.length; col++) {
      if (gameState[0][col] === gameState[1][col] && gameState[1][col] === gameState[2][col]) {
        return { winner: gameState[0][col], line: [[0, col], [1, col], [2, col]] };
      }
    }

    // Diagonal check (top-left to bottom-right)
    if (gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
      return { winner: gameState[0][0], line: [[0, 0], [1, 1], [2, 2]] };
    }

    // Diagonal check (top-right to bottom-left)
    if (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
      return { winner: gameState[0][2], line: [[0, 2], [1, 1], [2, 0]] };
    }

    // No winner yet
    const drawMatch = gameState.flat().every((e) => {
      if (e === "circle" || e === "cross") {
        return true;
      }
      return false;
    })
    if (drawMatch) {
      return "draw"
    }
    return null;
  };

  useEffect(() => {
    const result = checkwinner();
    console.log(result);
    if (result) {
      setFinished(true);
      setWinner(result.winner);
      setWinningLine(result.line);
      // Set the winning line here
    }
    if (result === "draw") {
      setFinished(true);
      setWinner("Draw");
    }
  }, [gameState]);


  const takePlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    return result;
  };

  socket?.on('connect', function () {
    setPlayOnline(true)
  })
  useEffect(() => {
    if (!socket) return;

    socket.on("player-move-from-server", (data) => {
      setGameState(prev => {
        let newState = [...prev]
        const row = Math.floor(data.state.id / 3)
        const col = data.state.id % 3
        newState[row][col] = data.state.currentplayer;
        return newState;
      });
      setCurrentPlayer(data.state.currentplayer === "circle" ? "cross" : "circle");
    });

    socket.on("opponent_found", (data) => {
      setOpponentName(data.opponentName);
      setPlayingAs(data.playingAs);
    });

    return () => {
      socket.off("player-move-from-server");
      socket.off("opponent_found");
    }
  }, [socket]);





  async function playOnlineON() {
    const result = await takePlayerName();
    setPlayerName(result.value)
    if (result.isConfirmed) {
      const newsocket = io("http://localhost:3001")

      newsocket?.emit("request_to_play", {
        playername: result.value
      })

      setSocket(newsocket)
    }
  }
  if (!playOnline) {

    return <div className='text-4xl m-4 bg-[#4B495F] p-[20px] rounded-lg items-center flex justify-center cursor-pointer' onClick={playOnlineON} >Play Online</div>
  }
  if (playOnline && !opponentName) {
    return <div className='text-4xl m-4 bg-[#4B495F] p-[20px] rounded-lg items-center flex justify-center cursor-pointer' >Waiting for opponent...</div>
  }

  return (
    <>
      <div className='flex justify-center items-center flex-col w-[100vw] h-[100vh]'>
        <div className='flex justify-between w-[300px]'>
          <div id='player' className={`w-[100px] h-[50px] bg-[#4B495F] items-center flex justify-center ${currentPlayer === playingAs ? "bg-[#fc5671]" : "bg-[#4B495F]"}`}>
            {playerName}
          </div>
          <div id='opponent' className={`w-[100px] h-[50px] bg-[#4B495F] items-center flex justify-center ${currentPlayer !== playingAs ? "bg-[#fc5671]" : "bg-[#4B495F]"}`}>
            {opponentName}
          </div>
        </div>

        <div className='p-[20px] rounded-lg bg-[#4B495F] text-4xl m-4'>Tic Tac Toe</div>

        {/* Grid with 3 columns */}
        <div className='grid grid-cols-3 gap-2'>
          {gameState.flat().map((square, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const isWinningSquare = winningLine && winningLine.some(([r, c]) => r === row && c === col);
            return (
              <Square
                key={index}
                value={index} // Pass the overall index
                setGameState={setGameState}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
                finished={finished}
                isWinningSquare={isWinningSquare}
                socket={socket}
                gameState={gameState}
                currenElement={square}
              />
            );
          })}
        </div>

        <div>
          {finished && <div className='text-4xl m-4'>Winner: {winner}</div>}

        </div>
      </div>
    </>
  );
}

export default App;
