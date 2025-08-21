import React, { useState, useEffect, useRef } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 25; // bigger cells for better look
const INITIAL_SNAKE = [{ x: 8, y: 8 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const intervalRef = useRef(null);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && direction.y === 0) setDirection({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && direction.y === 0) setDirection({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && direction.x === 0) setDirection({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && direction.x === 0) setDirection({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Game loop
  useEffect(() => {
    if (isGameOver) return;

    intervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const head = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check collision with walls or self
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)
        ) {
          setIsGameOver(true);
          clearInterval(intervalRef.current);
          return prevSnake;
        }

        // Eat food
        let newSnake;
        if (head.x === food.x && head.y === food.y) {
          newSnake = [head, ...prevSnake];
          setFood(getRandomFood(newSnake));
          setScore((s) => s + 1);
        } else {
          newSnake = [head, ...prevSnake.slice(0, -1)];
        }
        return newSnake;
      });
    }, 200);

    return () => clearInterval(intervalRef.current);
  }, [direction, food, isGameOver]);

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
    border: "4px solid #222",
    backgroundColor: "#f0f0f0",
    margin: "0 auto",
    borderRadius: "12px",
    position: "relative",
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "5px" }}>Snake Game</h1>
      <h2 style={{ marginTop: "0", color: "#333" }}>Score: {score}</h2>
      {isGameOver && <h3 style={{ color: "red" }}>Game Over!</h3>}
      <div style={gridStyle}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          const isSnake = snake.some((seg) => seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={idx}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: isSnake ? "#4caf50" : isFood ? "#ff5252" : "#fff",
                borderRadius: isSnake ? "50%" : "4px",
                border: "1px solid #ccc",
                transition: "background-color 0.2s",
              }}
            ></div>
          );
        })}
      </div>
      <button
        onClick={resetGame}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "18px",
          borderRadius: "8px",
          background: "#2196f3",
          color: "white",
          cursor: "pointer",
          border: "none",
          transition: "background 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.background = "#1976d2")}
        onMouseLeave={(e) => (e.target.style.background = "#2196f3")}
      >
        Reset Game
      </button>
    </div>
  );
}

// Helper to generate food
function getRandomFood(snake) {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y)) {
      return newFood;
    }
  }
}