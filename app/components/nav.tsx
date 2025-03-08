import React from 'react'
import { ModeToggle } from './ThemeSwitch'

interface NavProps {
    // playerOnePoint: number;
    // playerTwoPoint: number;
    playerOne: string;
    playerTwo: string[];
}

export const Nav = ({   playerOne, playerTwo}: NavProps) => {
    console.log(playerTwo);
    return (
      <div className="p-2">
            <div className="w-full p-2 bg-gradient-to-r from-primary/50 to-accent/50 rounded-md mb-5 grid sm:grid-cols-3 grid-cols-1  border border-primary/50">
                <div className='text-3xl font-semibold text-center sm:text-left'>
                    Memory Card Game 
                </div>
                <div className='flex gap-2 text-xl justify-center items-center'>
                    {playerOne || playerTwo.some(name => name.trim() !== "") ? (
                        <>
                            {playerOne && <div className='press-start-2p-regular'>Player 1: {playerOne}</div>}
                            {playerTwo.some(name => name.trim() !== "") && (
                                <div className='press-start-2p-regular'>
                                   {playerTwo[0]}  Vs {playerTwo[1]} 
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
                <div className='flex items-center gap-2 sm:justify-end justify-center'>Theme <ModeToggle /></div>
            </div>
        </div>
  )
}
