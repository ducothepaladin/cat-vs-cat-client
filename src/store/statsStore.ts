import type { Stats } from "@/types/Stats";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type StatsStore = {
  playerStats: Stats;
  remotePlayerStats: Stats;
  setPlayerStats: (data: Stats) => void;
  setRemotePlayerStats: (data: Stats) => void;
  reset: () => void;
};

const useStatsStore = create<StatsStore>()(
  persist(
    (set) => ({
      playerStats: { damage: 0, health: 1000 },
      remotePlayerStats: { damage: 0, health: 1000 },
      setPlayerStats: (data: Stats) => {
        set({ playerStats: data });
      },
      setRemotePlayerStats: (data: Stats) => {
        set({ remotePlayerStats: data });
      },
      reset: () => {
        set({
          playerStats: { damage: 0, health: 1000 },
          remotePlayerStats: { damage: 0, health: 1000 },
        });
      },
    }),
    {
      name: "stats-storage",
    }
  )
);

export default useStatsStore;
