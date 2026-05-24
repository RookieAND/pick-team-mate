import type { StateCreator } from 'zustand';
import type { AppState, GameSlice } from '../state';
import { makeDefaultPlayers } from '../helpers';

export const createGameSlice: StateCreator<AppState, [], [], GameSlice> = (set, get) => ({
  step: 'intro',
  teamA: [],
  teamB: [],
  resultA: [],
  resultB: [],

  setStep:      (step) => set({ step }),
  confirmTeams: (teamA, teamB) => set({ teamA, teamB, step: 'result', resultA: [], resultB: [] }),
  setResult:    (resultA, resultB) => set({ resultA, resultB }),

  reset: () => {
    const { settings } = get();
    set({
      step: 'input',
      players: makeDefaultPlayers(settings.use6v6 ? 12 : 10),
      teamA: [],
      teamB: [],
      resultA: [],
      resultB: [],
    });
  },
});
