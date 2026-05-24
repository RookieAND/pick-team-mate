import type { StateCreator } from 'zustand';
import type { AppState, PlayersSlice } from '../state';
import { makeDefaultPlayers } from '../helpers';

export const createPlayersSlice: StateCreator<AppState, [], [], PlayersSlice> = (set) => ({
  players: makeDefaultPlayers(10),

  setPlayers: (players) => set({ players }),
});
