import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Leaderboard } from "./Leaderboard";

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
  const [deckSet, setDeckSet] = useState<string>(localStorage.getItem("themeDeck") || "none");
  const backDeckRef = useRef<HTMLDivElement>(null); // Create a ref for the card back

  useEffect(() => {
    const updateDeckSet = () => {
      const newDeckSet = localStorage.getItem("themeDeck") || "none";
      setDeckSet(newDeckSet);
    };

    // Listen for storage changes
    window.addEventListener('storage', updateDeckSet);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', updateDeckSet);
    };
  }, []);

  useEffect(() => {
    if (backDeckRef.current) {
      // Clear only the specific class related to the deck
      backDeckRef.current.className = `card-back shadow-md text-primary-foreground border-2 border-black`; // Reset to base class
      backDeckRef.current.classList.add(`card-deck-${deckSet}`); // Add new class
    }
  }, [deckSet]); // Run this effect when deckSet changes

  return (
    <div className="card-container" onClick={onClick}>
      <div className={`card ${card.isFlipped || card.isMatched ? "flipped" : ""}`}>
        <div className="card-front shadow-md bg-neutral-100 text-black">
          {card.value}
        </div>
        <div ref={backDeckRef} className={`card-back shadow-md text-primary-foreground border-2 border-black`}></div>
      </div>
    </div>
  );
};

// Memory Game Component
const MemoryGame: React.FC<{ playerTwo: string[]; onScoreUpdate: (player1Score: number, player2Score: number) => void; playerOneName: string }> = ({ playerTwo, onScoreUpdate, playerOneName }) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardType[]>([]);
  const [matchedCards, setMatchedCards] = useState<CardType[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [isSelectingDifficulty, setIsSelectingDifficulty] = useState<boolean>(true);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1); // Track current player (1 or 2)
  const [playerScores, setPlayerScores] = useState<{ player1: number; player2: number }>({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState<string | null>(null); // Track the winner
  const [winnerScore, setWinnerScore] = useState<{player1: number, player2: number}>({player1: 0, player2: 0}); // Track the winner's score
  const scoreUpdatedRef = useRef(false); // Ref to track if scores have been updated

  // Function to initialize and shuffle cards
  const initializeCards = (difficultyLevel: string) => {
    setIsShuffling(true);
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
    setPlayerScores({ player1: 0, player2: 0 });
    setFlippedCards([]);
    setMatchedCards([]);

    // After shuffle delay, set isShuffling to false to indicate shuffle is done
    setTimeout(() => {
      setIsShuffling(false);
    }, 1000);
  };

  // Initialize cards when the component mounts or difficulty changes
  useEffect(() => {
    if (!isSelectingDifficulty) {
      initializeCards(difficulty);
    }
  }, [difficulty, isSelectingDifficulty]);

  // Handle card click
  const handleCardClick = (clickedCard: CardType): void => {
    if (
      flippedCards.length === 2 ||
      clickedCard.isFlipped ||
      clickedCard.isMatched
    )
      return;

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
          // Cards match
          setMatchedCards((prev) => [...prev, firstCard, secondCard]);
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.value === firstCard.value
                ? { ...card, isMatched: true }
                : card
            )
          );

          // Update score for the current player
          setPlayerScores((prevScores) => {
            const newScores = { ...prevScores };
            if (currentPlayer === 1) {
              newScores.player1 += 1;
            } else {
              newScores.player2 += 1;
            }
            return newScores;
          });

          // Player continues their turn
        } else {
          // Cards do not match
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.isMatched ? card : { ...card, isFlipped: false }
            )
          );

          // Switch to the next player
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }
        setFlippedCards([]);
      }, 500);
    }
  };

  // Check if all cards have been matched
  const isGameWon: boolean = matchedCards.length === cards.length;

  // Handle game completion
  useEffect(() => {
    if (isGameWon && !scoreUpdatedRef.current) {
      // Determine the winner
      const player1Score = playerScores.player1;
      const player2Score = playerScores.player2;

      // Check if player 1 wins
      if (player1Score > player2Score) {
        setWinner(playerTwo[0]); // Player 1 wins
        setWinnerScore((prev) => ({ ...prev, player1: prev.player1 + 1 })); // Increment Player 1's overall score
      } 
      // Check if player 2 wins
      else if (player2Score > player1Score) {
        setWinner(playerTwo[1]); // Player 2 wins
        setWinnerScore((prev) => ({ ...prev, player2: prev.player2 + 1 })); // Increment Player 2's overall score
      } 
      // If scores are equal, it's a tie
      else {
        setWinner(null); // Tie
      }

      // Dispatch updated scores to Nav component
      onScoreUpdate(winnerScore.player1 + (player1Score > player2Score ? 1 : 0), winnerScore.player2 + (player2Score > player1Score ? 1 : 0));

      // Mark that scores have been updated
      scoreUpdatedRef.current = true;
   
      console.log("Winner: score ", winnerScore);
    }
  }, [isGameWon, playerScores, playerTwo, onScoreUpdate]);

  // Modify handlePlayAgain to reset game-specific states
  const handlePlayAgain = () => {
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setPlayerScores((prevScores) => ({
      player1: prevScores.player1,
      player2: prevScores.player2,
    })); // Keep scores
    setCurrentPlayer(1); // Reset to player 1
    setIsSelectingDifficulty(true); // Go back to difficulty selection
    scoreUpdatedRef.current = false; // Reset the ref for the next game
  };

  const handleBackToHome = () => {
    // Reset all game states
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setPlayerScores({ player1: 0, player2: 0 }); // Reset scores
    setCurrentPlayer(1); // Reset to player 1
    window.location.reload(); // Reset player selection in parent component
  };

  return (
    <div className="game">
      {isSelectingDifficulty ? (
        <div className="difficulty-selection text-center">
          <h3 className="text-xl mb-4 press-start-2p-regular">Select Difficulty</h3>
          <div className="flex gap-4 justify-center mt-4">
            <Button onClick={() => { setDifficulty("easy"); setIsSelectingDifficulty(false); }}>Easy</Button>
            <Button onClick={() => { setDifficulty("medium"); setIsSelectingDifficulty(false); }}>Medium</Button>
            <Button onClick={() => { setDifficulty("hard"); setIsSelectingDifficulty(false); }}>Hard</Button>
            <Button onClick={() => { setDifficulty("extreme"); setIsSelectingDifficulty(false); }}>Extreme</Button>
          </div>
          <div className="mt-4">
            <Button onClick={handleBackToHome} variant="outline" className="text-foreground hover:bg-primary hover:text-primary-foreground">Back to Player Selection</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="board">
            {cards.map((card) => (
              <Card key={card.id} card={card} onClick={() => handleCardClick(card)} />
            ))}
          </div>
          {isShuffling && (
            <div className="shuffling-message text-center">
              <Button disabled>
                <Loader2 className="animate-spin" />
                Shuffling...
              </Button>
            </div>
          )}
          {!isShuffling && isGameWon ? (
            <div className="win-message text-center">
              <p className="text-lg font-bold press-start-2p-regular">Game Over!</p>
              {winner ? (
                <p className="text-md mt-2 press-start-2p-regular">{winner} wins!</p>
              ) : (
                <p className="text-md mt-2 press-start-2p-regular">It's a tie!</p>
              )}
              <p className="text-md mt-2 press-start-2p-regular">{playerTwo[0]}'s Score: {playerScores.player1}</p>
              <p className="text-md mt-2 press-start-2p-regular">{playerTwo[1]}'s Score: {playerScores.player2}</p>
              <div className="flex gap-4 justify-center mt-4">
                <Button onClick={handlePlayAgain} disabled={isShuffling}>Play Again</Button>
                <Button onClick={handleBackToHome}>Back to Home</Button>
              </div>
            </div>
            ) : (
                <div className="text-center mt-4">
                    <p className="text-lg font-bold press-start-2p-regular">Current Turn: {currentPlayer === 1 ? playerTwo[0] : playerTwo[1]}</p>
                </div>
          )}
          
        </>
      )}
    </div>
  );
};

export default MemoryGame;
