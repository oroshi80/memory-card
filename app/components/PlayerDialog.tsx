import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LucideUser } from "lucide-react";
import { toast } from "sonner";
const PlayerDialog = ({ setPlayer, isTwoPlayers }: { setPlayer: (name: string[]) => void; isTwoPlayers: boolean }) => {
  const [nameInput1, setNameInput1] = useState("");
  const [nameInput2, setNameInput2] = useState("");
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const handleSetPlayer = () => {
      if (isTwoPlayers) {
        if (nameInput1 === "" || nameInput2 === "") {
          toast.error("Please enter both player names");
          return;
        }
      setPlayer([nameInput1, nameInput2]); // Set both player names
      setNameInput1(""); // Clear the first input field
      setNameInput2(""); // Clear the second input field
      } else {
        if (nameInput1 === "") {
          toast.error("Please enter a player name");
          return;
        }
      setPlayer([nameInput1]); // Set the single player name
      setNameInput1(""); // Clear the input field
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (dialogContentRef.current) {
        dialogContentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button>
            {isTwoPlayers ? <><LucideUser /> <LucideUser /> players</> : <><LucideUser /> player</>}
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="mt-3" ref={dialogContentRef} onOpenAutoFocus={e=>e.preventDefault()}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                Enter {isTwoPlayers ? "players" : "player"} name 
              </motion.span>
            </DialogTitle>
            <div className="mt-2">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Label htmlFor="name1">Player 1</Label>
                <Input
                  type="text"
                  id="name1"
                  placeholder="Player 1"
                  value={nameInput1}
                  onChange={(e) => setNameInput1(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSetPlayer();
                    }
                  }}
                  className="transition-all duration-300 focus:scale-105 my-2"
                />
                {isTwoPlayers && (
                  <>
                    <Label htmlFor="name2">Player 2</Label>
                    <Input
                      autoFocus 
                      type="text"
                      id="name2"
                      placeholder="Player 2"
                      value={nameInput2}
                      onChange={(e) => setNameInput2(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSetPlayer();
                        }
                      }}
                      className="transition-all duration-300 focus:scale-105 my-2"
                    />
                  </>
                )}
              </motion.div>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleSetPlayer}>Set</Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog; 