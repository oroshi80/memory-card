import React, { useEffect, useState } from 'react'
import { ModeToggle } from './ThemeSwitch'

interface NavProps {
    // playerOnePoint: number;
    // playerTwoPoint: number;
    playerOne: string;
    playerTwo: string[];
    playerOneScore: number;
    playerTwoScore: number;
}

export const Nav = ({ playerOne, playerTwo, playerOneScore, playerTwoScore }: NavProps) => {
    
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Trigger animation when player names change
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 500); // Reset animation after 500ms
        return () => clearTimeout(timer);
    }, [playerOne, playerTwo]);
    
    console.log("Player info: ", playerTwo);
    return (
      <div className="p-2">
            <div className="w-full p-2 bg-gradient-to-r from-primary/50 to-accent/50 rounded-md mb-5 grid sm:grid-cols-3 grid-cols-1  border border-primary/50">
                <div className='text-3xl font-semibold text-center sm:text-left'>
                    Memory Card Game 
                </div>
                <div className='flex gap-2 text-xl justify-center items-center'>
                    {playerOne && (
                        <div className={`press-start-2p-regular ${animate ? 'drop-impact' : ''}`}>
                            Player: {playerOne} 
                        </div>
                    )}
                    {playerTwo.some(name => name.trim() !== "") && (
                        <div className={`press-start-2p-regular ${animate ? 'drop-impact' : ''}`}>
                            {playerTwo[0]} ({playerOneScore}) Vs {playerTwo[1]} ({playerTwoScore})
                        </div>
                    )}
                </div>
                <div className='flex items-center gap-2 sm:justify-end justify-center'>Theme <ModeToggle /></div>
            </div>
        </div>
  )
}
