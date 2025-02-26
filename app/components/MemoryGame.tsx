import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Leaderboard } from "./Leaderboard";
import { motion } from "framer-motion";
// Define the type for a card
type CardType = {
  value: string;
  id: number;
  isFlipped: boolean;
  isMatched: boolean;
};

// Define props for the Card component
type CardProps = {
  card: CardType;
  onClick: () => void;
};

// Card Component with Flip Animation
const Card: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <div className="card-container" onClick={onClick}>
      <div
        className={`card ${card.isFlipped || card.isMatched ? "flipped" : ""} `}
      >
        <div className="card-front shadow-md bg-neutral-100 text-black">
          {card.value}
        </div>
        <div className="card-back shadow-md text-primary-foreground bg-primary border-2 border-black"></div>
      </div>
    </div>
  );
};

// Memory Game Component
const MemoryGame: React.FC<{ oneUpName: string }> = ({ oneUpName }) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardType[]>([]);
  const [matchedCards, setMatchedCards] = useState<CardType[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false); // Track shuffle state
  const [difficulty, setDifficulty] = useState<string>("easy"); // Default to 'easy'
  const [isSelectingDifficulty, setIsSelectingDifficulty] =
    useState<boolean>(true); // Track if user is selecting difficulty
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState<string>("");

  // Function to initialize and shuffle cards
  const initializeCards = (difficultyLevel: string) => {
    setIsShuffling(true); // Start shuffling
    let cardValues: string[] = [];

    // Define number of pairs based on difficulty level
    switch (difficultyLevel) {
      case "easy":
        cardValues = ["😀", "😎", "💗", "👋", "🤪", "😰"];
        break;
      case "medium":
        cardValues = ["😀", "😎", "💗", "👋", "🤪", "😰", "😍", "🦄"];
        break;
      case "hard":
        cardValues = [
          "😀",
          "😎",
          "💗",
          "👋",
          "🤪",
          "😰",
          "😍",
          "🦄",
          "😂",
          "🥳",
        ];
        break;
      case "extreme":
        cardValues = [
          "😀",
          "😎",
          "💗",
          "👋",
          "🤪",
          "😰",
          "😍",
          "🦄",
          "😂",
          "🥳",
          "😢",
          "🦋",
          "🍀",
        ];
        break;
      default:
        cardValues = ["😀", "😎", "💗", "👋", "🤪", "😰"];
    }

    const shuffledCards: CardType[] = cardValues
      .map((value, index) => ({
        value,
        id: index,
        isFlipped: false,
        isMatched: false,
      }))
      .concat(
        cardValues.map((value, index) => ({
          value,
          id: cardValues.length + index,
          isFlipped: false,
          isMatched: false,
        }))
      ) // Duplicate the card values to make pairs
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);

    // After shuffle delay, set isShuffling to false to indicate shuffle is done
    setTimeout(() => {
      setIsShuffling(false);
    }, 1000); // Give a 1-second shuffle time (you can adjust as needed)
  };

  // Initialize cards when the component mounts or difficulty changes
  useEffect(() => {
    if (!isSelectingDifficulty) {
      initializeCards(difficulty);
    }
  }, [difficulty, isSelectingDifficulty]);

  // Function to format milliseconds to HH:MM:SS
  const formatTime = (ms: number): string => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Modify handleCardClick to start timer on first click
  const handleCardClick = (clickedCard: CardType): void => {
    if (
      flippedCards.length === 2 ||
      clickedCard.isFlipped ||
      clickedCard.isMatched
    )
      return;

    // Start timer on first card click
    if (!startTime) {
      setStartTime(Date.now());
    }

    const updatedFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(updatedFlippedCards);

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );

    if (updatedFlippedCards.length === 2) {
      const [firstCard, secondCard] = updatedFlippedCards;

      setTimeout(() => {
        if (firstCard.value === secondCard.value) {
          setMatchedCards((prev) => [...prev, firstCard, secondCard]);
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.value === firstCard.value
                ? { ...card, isMatched: true }
                : card
            )
          );
        } else {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.isMatched ? card : { ...card, isFlipped: false }
            )
          );
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  // Check if all cards have been matched
  const isGameWon: boolean = matchedCards.length === cards.length;

  // Update useEffect to handle game completion
  useEffect(() => {
    if (isGameWon && startTime && !endTime) {
      const end = Date.now();
      setEndTime(end);
      const totalTime = end - startTime;
      setGameTime(formatTime(totalTime));

      // Post to leaderboard
      const postScore = async () => {
        try {
          const response = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: oneUpName,
              level: difficulty,
              bestTime: totalTime, // Store raw milliseconds for sorting
              date: new Date().toISOString(),
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to post score');
          }
        } catch (error) {
          console.error('Error posting score:', error);
        }
      };

      postScore();
    }
  }, [isGameWon, startTime, endTime, oneUpName, difficulty]);

  // Modify handlePlayAgain to only reset game-specific states
  const handlePlayAgain = () => {
    setStartTime(null);
    setEndTime(null);
    setGameTime("");
    setIsSelectingDifficulty(true);
  };

  const handleBackToHome = () => {
    // Reset all game states
    setStartTime(null);
    setEndTime(null);
    setGameTime("");
    setIsSelectingDifficulty(true);
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    // Reset player selection in parent component
    window.location.reload();
  };

  return (
    <div className="game">
      {isSelectingDifficulty ? (
        <div className="difficulty-selection text-center">
          <h2 className="text-2xl font-bold mb-2">Player: {oneUpName}</h2>
          <h3 className="text-xl mb-4">Select Difficulty</h3>
          <div className="flex gap-4 justify-center mt-4">
            <Button
              onClick={() => {
                setDifficulty("easy");
                setIsSelectingDifficulty(false);
              }}
            >
              Easy
            </Button>
            <Button
              onClick={() => {
                setDifficulty("medium");
                setIsSelectingDifficulty(false);
              }}
            >
              Medium
            </Button>
            <Button
              onClick={() => {
                setDifficulty("hard");
                setIsSelectingDifficulty(false);
              }}
            >
              Hard
            </Button>
            <Button
              onClick={() => {
                setDifficulty("extreme");
                setIsSelectingDifficulty(false);
              }}
            >
              Extreme
            </Button>
          </div>
          <div className="mt-4">
            <Button 
              onClick={handleBackToHome}
              variant="outline"
              className="text-foreground hover:bg-primary hover:text-primary-foreground"
            >
              Back to Player Selection
            </Button>
          </div>
        </div>
      ) : (
        // Game Board
        <>
          <div className="text-center text-2xl p-2">
            {oneUpName && <div>Player: {oneUpName}</div>}
          </div>
          <Separator />
          <div className="board">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
          {/* Show Shuffle status */}
          {isShuffling && (
            <div className="shuffling-message text-center">
              <Button disabled>
                <Loader2 className="animate-spin" />
                Shuffling...
              </Button>
            </div>
          )}
          {/* Updated win message with three buttons */}
          {!isShuffling && isGameWon && (
            <div className="win-message text-center">
              <p className="text-lg font-bold">You win! 🎉</p>
              <p className="text-md mt-2">Completion Time: {gameTime}</p>
              <div className="flex gap-4 justify-center mt-4">
                <Button
                  onClick={handlePlayAgain}
                    disabled={isShuffling}
                >
                  Play Again
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" className="text-foreground hover:bg-primary hover:text-primary-foreground">
                        View Leaderboard
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
                <Button 
                  onClick={handleBackToHome}
                  variant="outline"
                  className="text-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemoryGame;
