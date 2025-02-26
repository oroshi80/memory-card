import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";

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

  // Handle card click event
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

  return (
    <div className="game">
      {/* Difficulty Selection Screen */}
      {isSelectingDifficulty ? (
        <div className="difficulty-selection text-center">
          <h2 className="text-2xl font-bold">Select Difficulty</h2>
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
        </div>
      ) : (
        // Game Board
        <>
          <div className="text-center text-2xl p-2">
            {oneUpName && <div>Player one: {oneUpName}</div>}
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
          {/* Show "You Win" message only after game is completed */}
          {!isShuffling && isGameWon && (
            <div className="win-message text-center">
              <p className="text-lg font-bold">You win! 🎉</p>
              <Button
                onClick={() => {
                  setIsSelectingDifficulty(true);
                }}
                className="mt-4"
                disabled={isShuffling}
              >
                Play Again
              </Button>
            </div>
          )}
          <div>Try to beat time </div>
        </>
      )}
    </div>
  );
};

export default MemoryGame;
