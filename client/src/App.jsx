import React, { useState } from 'react'
import './App.css'
import Square from './components/Square'
function App() {
  const renderSquare =[
    [1,2,3],
    [4,5,6],
    [7,8,9]
  ]
  const [gameState, setGameState] = useState(renderSquare)
  return (
    <div className='flex justify-center items-center flex-col w-[100vw] h-[100vh]'>
      <div className='flex justify-between w-[300px]'>
        <div id='player' className='w-[100px] h-[50px] bg-[#4B495F] items-center flex justify-center'  >
          alsjdlkasjd
        </div>
        <div id='oponent' className='w-[100px] h-[50px] bg-[#fc5671] items-center flex justify-center'>
          alsjdlkasjd
        </div>

      </div>
           
      <div className='p-[20px] rounded-lg bg-[#4B495F] text-4xl m-4'>Tic Tac Toe</div>
      <div className='grid grid-cols-3 gap-2'>
        {gameState.map((row, rowIndex) => (
          <div key={rowIndex} className='flex gap-2 flex-col'>
            {row.map((square, squareIndex) => (
              <Square key={squareIndex} value={square} setGameState={setGameState}/>
            ))}
          </div>
        ))}
      </div>


    </div>
  )
}

export default App