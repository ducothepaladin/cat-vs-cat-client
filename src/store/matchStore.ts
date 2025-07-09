import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerInput, Position, Slot } from "@/types/Match";

type MatchStore = {
  matchId: string | null;
  slotId: string | null;
  matchSlot: Slot[];
  isBothReady: boolean;
  position: Position | null;
  pPosition: Position | null;
  playerInput: PlayerInput;
  isWin: "win" | "lose" | null;
  setIsWin: (status: "win" | "lose" | null) => void;
  setMatchId: (id: string) => void;
  clearMatchId: () => void;
  setSlotId: (id: string) => void;
  clearSlotId: () => void;
  setMatchSlot: (slots: Slot[]) => void;
  removeSlot: (id: string) => void;
  setBothReady: (value: boolean) => void;
  setPlayerInput: (input: PlayerInput) => void;
  setPosition: (pos: Position) => void;
  setPPosition: (pos: Position) => void;
  reset: () => void;
};

const initialPlayerInput: PlayerInput = {
  up: false,
  down: false,
  left: false,
  right: false,
  attack: false,
};

const useMatchStore = create<MatchStore>()(
  persist(
    (set) => ({
      matchId: null,
      slotId: null,
      matchSlot: [],
      isBothReady: false,
      position: null,
      pPosition: null,
      playerInput: initialPlayerInput,
      isWin: null,
      setIsWin: (status: "win" | "lose" | null) => set({ isWin: status }),
      setMatchId: (id) => set({ matchId: id }),
      clearMatchId: () => set({ matchId: null }),
      setSlotId: (id) => set({ slotId: id }),
      clearSlotId: () => set({ slotId: null }),
      setMatchSlot: (slots) => set({ matchSlot: slots }),
      removeSlot: (id) =>
        set((state) => ({
          matchSlot: state.matchSlot.filter((slot) => slot.id !== id),
        })),
      setBothReady: (value) => set({ isBothReady: value }),
      setPlayerInput: (input) => set({ playerInput: input }),
      setPosition: (pos) => set({ position: pos }),
      setPPosition: (pos) => set({ pPosition: pos }),
      reset: () => {
        set({
          matchId: null,
          slotId: null,
          matchSlot: [],
          isBothReady: false,
          position: null,
          pPosition: null,
          playerInput: initialPlayerInput,
          isWin: null,
        });
      },
    }),
    { name: "match-storage" }
  )
);

export const getSlotId = () => useMatchStore.getState().slotId;
export const getMatchId = () => useMatchStore.getState().matchId;

export default useMatchStore;
