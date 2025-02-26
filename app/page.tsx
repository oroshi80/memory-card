"use client";
import React, { useState } from "react";
import MemoryCard from "@/app/components/MemoryGame";
import { ModeToggle } from "@/app/components/ThemeSwitch";
import { Button } from "@/components/ui/button";
import { LucideClipboardList, LucideUser } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Leaderboard } from "./components/Leaderboard";
import { motion } from "framer-motion";

export default function Home() {
  const [player, setPlayer] = useState("");
  const [oneUpName, setOneUpName] = useState("");
  // const [twoUpName, setTwoUpName] = useState("");

  // State for dialog input value
  const [nameOneInput, setNameOneInput] = useState("");

  const onePlayer = () => {
    setPlayer("1up");
    setOneUpName(nameOneInput); // Set the name from the dialog
    setNameOneInput(""); // Clear the input field after setting
  };

  const twoPlayers = () => {
    setPlayer("2up");
  };

  return (
    <div className="p-4">
      <div className="w-full p-2 text-3xl text-center font-semibold bg-slate-400 rounded-md mb-5">
        Memory Card Game <ModeToggle />
      </div>
      <div className="flex items-center justify-center">
        <div className="flex p-5 bg-secondary w-full sm:w-[50%] rounded-lg justify-center items-center ">
          {player === "1up" ? (
            /* 1up */
            <MemoryCard oneUpName={oneUpName} />
          ) : player === "2up" ? (
            /* 2up */
            <div className="flex flex-col">
              <div className="text-center">Coming soon!</div>
              <div className="text-center mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <LucideUser /> player
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="mt-3">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        What is your name?
                      </DialogTitle>
                      <DialogDescription>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          type="text"
                          id="name"
                          placeholder="John Doe"
                          value={nameOneInput}
                          onChange={(e) => setNameOneInput(e.target.value)} // Capture input
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              onePlayer(); // Call onePlayer function when Enter is pressed
                            }
                          }}
                        />
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button onClick={onePlayer}>Set</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ) : (
            //  Select 1up or 2up
            <>
              <div className=" flex flex-col">
                <div className="text-center text-2xl mb-4">Select Player</div>
                <div className="flex gap-10">
                  <Dialog>
                    <DialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button>
                          <LucideUser /> player
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
                              What is your name?
                            </motion.span>
                          </DialogTitle>
                          <div className="mt-2">
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Label htmlFor="name">Name</Label>
                              <Input
                                type="text"
                                id="name"
                                placeholder="John Doe"
                                value={nameOneInput}
                                onChange={(e) => setNameOneInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    onePlayer();
                                  }
                                }}
                                className="transition-all duration-300 focus:scale-105 my-2"
                              />
                            </motion.div>
                          </div>
                        </DialogHeader>
                        <DialogFooter className="mt-2">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button onClick={onePlayer}>Set</Button>
                          </motion.div>
                        </DialogFooter>
                      </motion.div>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={twoPlayers}>
                    <LucideUser />
                    <LucideUser /> players
                  </Button>
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
