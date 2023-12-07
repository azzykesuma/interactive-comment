import React from 'react'
import Image from 'next/image';

function ScoreCounter(props) {
    const {score,id,incrementScore,decrementScore} = props;
  return (
    <div className='flex items-center gap-4 bg-Light-gray p-2 rounded md:flex-col'>
        <button onClick={() => incrementScore(id)}><Image src={'/images/icon-plus.svg'} width={10} height={10} alt="plus-icon" /></button>
        <p className='text-sm font-bold text-Moderate-blue'>{score}</p>
        <button onClick={() => decrementScore(id)}><Image src={'/images/icon-minus.svg'} width={10} height={10} alt="minus-icon" /></button>
    </div>
  )
}

export default ScoreCounter
