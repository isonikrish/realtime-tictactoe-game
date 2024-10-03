import React,{useState} from 'react'
import {FaTimes,FaRegCircle} from 'react-icons/fa'
function Square({value,setGameState  }) {
  const[icon,setIcon]=useState(null)
  const cross= <FaTimes/>
  const circle= <FaRegCircle />
  return (
    <div className='bg-[#4B495F] w-[100px] h-[100px] rounded-md cursor-pointer flex justify-center items-center text-4xl text-white'></div>
  )
}

export default Square