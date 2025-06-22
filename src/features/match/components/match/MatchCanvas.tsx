import { useCallback, useEffect, useRef, useState } from "react";
import { getGameSizes } from "../../../../lib/helper/canvas";
import type { GameSizes } from "../../../../types/Match";
import { Game } from "../../../../game/Game";
import { getUserById } from "../../hooks/useUserQuery";
import { useGotHit, usePlayerActed, useUpdatePosition } from "../../hooks/useMatchEvent";
import useMatchStore from "@/store/matchStore";
import WinningPopUp from "./WinningPopUp";

function MatchCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameSize, setGameSize] = useState<GameSizes>(getGameSizes());
  const {matchSlot} = useMatchStore()


  const { data: user, isLoading} = getUserById();

  usePlayerActed();
  useUpdatePosition();
  useGotHit();

  const updateGameSize = useCallback(() => {
    setGameSize(getGameSizes());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateGameSize);
    return () => {
      window.removeEventListener("resize", updateGameSize);
    };
  }, [updateGameSize]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = gameSize.width;
    canvas.height = gameSize.height;

    if(user && matchSlot.length > 1) {
      const game = new Game(canvas, gameSize.tileSize, user.id);
      game.start();
    }

    
  }, [gameSize, user, matchSlot]);

  if (isLoading || !user) return <>Loading...</>;

  return (
    <div className="w-full h-full relative">
      <canvas
      className="w-full h-full"
      ref={canvasRef}
    ></canvas>
    <WinningPopUp />
    </div>
  );
}

export default MatchCanvas;
