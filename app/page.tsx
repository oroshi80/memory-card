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
                  <Button onClick={twoPlayers}>
                    <LucideUser />
                    <LucideUser /> players
                  </Button>
                </div>
                <Separator className="mt-4 bg-neutral-500" />

                <div className="flex justify-center items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="m-2">
                        <LucideClipboardList /> View Leaderboard
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="mt-3">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                          Leaderboard
                        </DialogTitle>
                        <>
                          <Leaderboard />
                        </>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="destructive">Close</Button>
                        </DialogClose>
                      </DialogFooter>
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
