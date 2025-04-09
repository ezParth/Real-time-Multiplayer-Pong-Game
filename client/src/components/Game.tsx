import React, { useEffect, useRef, useState } from "react";

const Game: React.FC = () => {
  const [playerY, setPlayerY] = useState(200);
  const [ball, setBall] = useState({ x: 300, y: 200, dx: 6, dy: 6 });
  const [computerY, setComputerY] = useState(200);
  const [isPlaying, setIsPlaying] = useState(false);

  const keyPressedRef = useRef<{ [key: string]: boolean }>({});
  const ballRef = useRef(ball);
  const playerYRef = useRef(playerY);
  const computerRef = useRef(computerY);

  const gameRef = useRef<HTMLDivElement | null>(null);

  // Handle player movement
  useEffect(() => {
    const handleInterval = setInterval(() => {
      if (keyPressedRef.current["arrowup"]) {
        setPlayerY((prev) => {
          const newY = Math.max(prev - 20, 0);
          playerYRef.current = newY;
          return newY;
        });
      } else if (keyPressedRef.current["arrowdown"]) {
        setPlayerY((prev) => {
          const newY = Math.min(prev + 20, 400);
          playerYRef.current = newY;
          return newY;
        });
      }
    }, 16);

    return () => clearInterval(handleInterval);
  }, []);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        if (key === "arrowup" || key === "arrowdown" || key === "w" || key === "s") {
          keyPressedRef.current[key] = true;
        }
      };
      
      const handleKeyUp = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        if (key === "arrowup" || key === "arrowdown" || key === "w" || key === "s") {
          keyPressedRef.current[key] = false;
        }
      };
      
      

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBall((prev) => {
        const newX = prev.x + prev.dx;
        const newY = prev.y + prev.dy;
        let newDx = prev.dx;
        let newDy = prev.dy;

        // Bounce off top and bottom
        if (newY <= 0 || newY >= 480) newDy = -newDy;

        const currentPlayerY = playerYRef.current;
        const currentComputerY = computerRef.current;

        // Bounce off left (player) paddle
        if (
          newX <= 20 &&
          newY >= currentPlayerY &&
          newY <= currentPlayerY + 100
        ) {
          newDx = -newDx;
        }

        // Bounce off right (computer) paddle
        if (
          newX >= 640 &&
          newY >= currentComputerY &&
          newY <= currentComputerY + 100
        ) {
          newDx = -newDx;
        }

        // Game over if ball leaves screen
        if (newX < 0 || newX > 700) {
          setIsPlaying(false);
        }

        const updatedBall = { x: newX, y: newY, dx: newDx, dy: newDy };
        ballRef.current = updatedBall;
        return updatedBall;
      });

      // Move computer paddle
      setComputerY((prev) => {
        const ballY = ballRef.current.y;
        const newY = prev + 10 * Math.sign(ballY - (prev + 50));
        const clampedY = Math.max(0, Math.min(400, newY));
        computerRef.current = clampedY;
        return clampedY;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync refs with latest state
  useEffect(() => {
    playerYRef.current = playerY;
  }, [playerY]);

  useEffect(() => {
    computerRef.current = computerY;
  }, [computerY]);

  useEffect(() => {
    ballRef.current = ball;
  }, [ball]);

  useEffect(() => {
    const handlePressEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isPlaying) {
        setIsPlaying(true);
        setPlayerY(200);
        setComputerY(200);
        setBall({ x: 300, y: 200, dx: 6, dy: 6 });
      }
    };
  
    window.addEventListener("keypress", handlePressEnter);
    return () => window.removeEventListener("keypress", handlePressEnter);
  }, [isPlaying]);
  
  
  // Game Over screen
  if (!isPlaying) {

    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <button
          className="p-4 m-4 bg-amber-400 text-white font-bold rounded-lg shadow-lg hover:bg-amber-500 transition"
          onClick={() => {
            setIsPlaying(true);
            setPlayerY(200);
            setComputerY(200);
            setBall({ x: 300, y: 200, dx: 6, dy: 6 });
          }}
        >
          Restart Game
        </button>
      </div>
    );
  }

// Same imports and logic...

return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {!isPlaying ? (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-lg">Ping Pong Game</h1>
          <button
            className="px-6 py-3 bg-amber-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-amber-600 transition-all duration-300"
            onClick={() => {
              setIsPlaying(true);
              setPlayerY(200);
              setComputerY(200);
              setBall({ x: 300, y: 200, dx: 6, dy: 6 });
            }}
          >
            Start Game
          </button>
          <p className="mt-4 text-gray-400 text-sm">Press <kbd className="bg-gray-700 px-2 py-1 rounded">Enter</kbd> to start too</p>
        </div>
      ) : (
        <div
          ref={gameRef}
          className="relative w-[700px] h-[500px] bg-black border-[6px] border-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Optional scoreboard */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-xl tracking-widest">
            PONG
          </div>
  
          {/* Player paddle */}
          <div
            className="absolute left-2 w-2 h-[100px] bg-white rounded-full shadow-lg"
            style={{ top: `${playerY}px` }}
          ></div>
  
          {/* Computer paddle */}
          <div
            className="absolute right-2 w-2 h-[100px] bg-white rounded-full shadow-lg"
            style={{ top: `${computerY}px` }}
          ></div>
  
          {/* Ball */}
          <div
            className="absolute w-5 h-5 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]"
            style={{ top: `${ball.y}px`, left: `${ball.x}px` }}
          ></div>
        </div>
      )}
    </div>
  );
  
};

export default Game;
