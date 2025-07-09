import { socket } from "@/api/socket";
import useMatchStore from "@/store/matchStore";
import useStatsStore from "@/store/statsStore";
import type { PlayerInput, Position } from "@/types/Match";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useMatchStarted = () => {
  const { setMatchId, matchId } = useMatchStore();
  const navigate = useNavigate();

  useEffect(() => {
    function handleMatchStarted({ matchId }: { matchId: string }) {
      setMatchId(matchId);
      navigate("/match");
    }

    socket.on("match_started", handleMatchStarted);

    return () => {
      socket.off("match_started");
    };
  }, [matchId]);

  return;
};

export const usePlayerActed = () => {
  const { setPlayerInput } = useMatchStore();

  useEffect(() => {
    function handlePlayerActed({ input }: { input: PlayerInput }) {
      setPlayerInput(input);
    }

    socket.on("player_acted", handlePlayerActed);

    return () => {
      socket.off("player_acted", handlePlayerActed);
    };
  }, []);
};

export const useUpdatePosition = () => {
  const { setPosition } = useMatchStore();

  useEffect(() => {
    function handleUpdatePosition({ position }: { position: Position }) {
      setPosition(position);
    }

    socket.on("position_updated", handleUpdatePosition);

    return () => {
      socket.off("position_updated", handleUpdatePosition);
    };
  }, []);

  return;
};

export const useGotHit = () => {
  const { setPlayerStats, playerStats } = useStatsStore();

  useEffect(() => {
    function handleGotHit({ updateHealth }: { updateHealth: number }) {
      console.log("work");
      const update = { ...playerStats, health: updateHealth };
      setPlayerStats(update);
    }

    socket.on("got_hit", handleGotHit);

    return () => {
      socket.on("got_hit", handleGotHit);
    };
  }, []);

  return;
};
