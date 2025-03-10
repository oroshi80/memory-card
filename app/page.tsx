"use client";
import React, { useState } from "react";
import MemoryCard from "@/app/components/MemoryGame";
import { Separator } from "@/components/ui/separator";
import { Leaderboard } from "./components/Leaderboard";
import PlayerDialog from "@/app/components/PlayerDialog";
import { Nav } from "@/app/components/nav";
import MemoryGame2up from "./components/MemoryGame2up";


export default function Home() {
  const [player, setPlayer] = useState("");
  const [oneUpName, setOneUpName] = useState("");
  const [twoUpNames, setTwoUpNames] = useState(["", ""]);
  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);


  const onePlayer = (name: string[]) => {
    setPlayer("1up");
    setOneUpName(name[0]);
  };

  const twoPlayers = (names: string[]) => {
    setPlayer("2up");
    setTwoUpNames(names);
  };

  const handleScoreUpdate = (player1Score: number, player2Score: number) => {
    setPlayerOneScore(player1Score);
    setPlayerTwoScore(player2Score);
  };

  return (
    <>
        <Nav playerOne={oneUpName} playerTwo={twoUpNames} playerOneScore={playerOneScore} playerTwoScore={playerTwoScore} />
      <div className="flex items-center justify-center">
        <div className="flex p-5 bg-secondary w-full sm:w-[50%] rounded-lg justify-center items-center ">
          {player === "1up" ? (
            <MemoryCard oneUpName={oneUpName} />
          ) : player === "2up" ? (
            <div className="flex flex-col">
                <div className="text-center mt-2">
                <MemoryGame2up playerTwo={twoUpNames} onScoreUpdate={handleScoreUpdate} playerOneName={oneUpName} />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <div className="text-center text-2xl mb-4 press-start-2p-regular">Select Player</div>
                <div className="flex gap-10 justify-center items-center">
                  <PlayerDialog setPlayer={onePlayer} isTwoPlayers={false} />
                  <PlayerDialog setPlayer={twoPlayers} isTwoPlayers={true} />
                </div>
                <Separator className="mt-4 bg-neutral-500" />

                <div className="flex justify-center items-center mt-4">
                  <Leaderboard />                          
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
