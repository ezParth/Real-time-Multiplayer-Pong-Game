import React, { useEffect, useRef, useState } from "react";

const Game: React.FC = () => {
  const [playerY, setPlayerY] = useState(200);
  const [ball, setBall] = useState({ x: 300, y: 200, dx: 6, dy: 6 });
  const [computerY, setComputerY] = useState(200);
  const [restartGame, setRestartGame] = useState<boolean>(false);

  const gameRef = useRef<HTMLDivElement | null>(null);

  // Handle paddle movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "W") {
        setPlayerY((prev) => Math.max(prev - 60, 0));
      } else if (e.key === "s" || e.key === "S") {
        setPlayerY((prev) => Math.min(prev + 60, 400));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBall((prev) => {
        let newX = prev.x + prev.dx;
        let newY = prev.y + prev.dy;
        let newDx = prev.dx;
        let newDy = prev.dy;

        if(newX < 0 || newX > 700) {
            setRestartGame(true);
        }

        // bounce top and bottom
        if (newY <= 0 || newY >= 480) newDy = -newDy;

        // bounce left paddle
        if (
          newX <= 20 &&
          newY >= playerY &&
          newY <= playerY + 100
        ) {
          newDx = -newDx;
        }

        // bounce right paddle
        if (
          newX >= 640 &&
          newY >= computerY &&
          newY <= computerY + 100
        ) {
          newDx = -newDx;
        }

        return { x: newX, y: newY, dx: newDx, dy: newDy };
      });

      setComputerY((prev) => {
        if (prev + 50 < ball.y) return Math.min(prev + 10, 400);
        else return Math.max(prev - 10, 0);

      });
    }, 16);

    // console.log("HELLO WORLD")

    return () => {
        clearInterval(interval);
        setRestartGame(false);
    }
  }, [playerY, computerY, ball, restartGame]);

  useEffect(() => {
    // console.log("Game Over.")
  }, [restartGame])

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-900">
      <div
        ref={gameRef}
        className="relative w-[700px] h-[500px] bg-black border-4 border-white overflow-hidden"
      >
        {/* Player paddle */}
        <div
          className="absolute left-2 w-2 h-[100px] bg-white rounded"
          style={{ top: `${playerY}px` }}
        ></div>

        {/* Computer paddle */}
        <div
          className="absolute right-2 w-2 h-[100px] bg-white rounded"
          style={{ top: `${computerY}px` }}
        ></div>

        {/* Ball */}
        <div
          className="absolute w-4 h-4 bg-white rounded-full"
          style={{ top: `${ball.y}px`, left: `${ball.x}px` }}
        ></div>
      </div>
    </div>
  );
};

export default Game;
