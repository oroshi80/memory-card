"use client";
import React, { useState } from "react";
import MemoryCard from "@/app/components/MemoryGame";
import { ModeToggle } from "@/app/components/ThemeSwitch";
import { Button } from "@/components/ui/button";
import { LucideClipboardList } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Leaderboard } from "./components/Leaderboard";
import { motion } from "framer-motion";
import PlayerDialog from "@/app/components/PlayerDialog";

export default function Home() {
  const [player, setPlayer] = useState("");
  const [oneUpName, setOneUpName] = useState("");
  const [twoUpNames, setTwoUpNames] = useState(["", ""]);

  const onePlayer = (name: string[]) => {
    setPlayer("1up");
    setOneUpName(name[0]);
  };

  const twoPlayers = (names: string[]) => {
    setPlayer("2up");
    setTwoUpNames(names);
  };

  return (
    <div className="p-4">
      <div className="w-full p-2 text-3xl text-center font-semibold bg-slate-400 rounded-md mb-5">
        Memory Card Game <ModeToggle />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex p-5 bg-secondary w-full sm:w-[50%] rounded-lg justify-center items-center ">
          {player === "1up" ? (
            <MemoryCard oneUpName={oneUpName} />
          ) : player === "2up" ? (
            <div className="flex flex-col">
              <div className="text-center">Coming soon!</div>
                <div className="text-center mt-2">
                  {twoUpNames && <div>Player: {oneUpName} vs Player: {twoUpNames}</div>} 
                <PlayerDialog setPlayer={onePlayer} isTwoPlayers={false} />

              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <div className="text-center text-2xl mb-4">Select Player</div>
                <div className="flex gap-10">
                  <PlayerDialog setPlayer={onePlayer} isTwoPlayers={false} />
                  <PlayerDialog setPlayer={twoPlayers} isTwoPlayers={true} />
                </div>
                <Separator className="mt-4 bg-neutral-500" />

                <div className="flex justify-center items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="m-2">
                          <LucideClipboardList /> View Leaderboard
                        </Button>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className="mt-3">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold">
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              Leaderboard
                            </motion.span>
                          </DialogTitle>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Leaderboard />
                          </motion.div>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button variant="destructive">Close</Button>
                            </motion.div>
                          </DialogClose>
                        </DialogFooter>
                      </motion.div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
