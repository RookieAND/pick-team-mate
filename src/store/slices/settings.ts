import type { StateCreator } from 'zustand';
import type { AppState, SettingsSlice } from '../state';
import { makeDefaultPlayers } from '../helpers';

export const createSettingsSlice: StateCreator<AppState, [], [], SettingsSlice> = (set, get) => ({
  settings: { useMost: false, useBan: false, use6v6: false },

  setUseMost: (v) => set((s) => ({ settings: { ...s.settings, useMost: v } })),
  setUseBan: (v) => set((s) => ({ settings: { ...s.settings, useBan: v } })),

  setUse6v6: (v) => {
    const { players, settings } = get();
    const targetCount = v ? 12 : 10;
    const newPlayers =
      targetCount > players.length
        ? [
            ...players,
            ...makeDefaultPlayers(targetCount - players.length).map((p, i) => ({
              ...p,
              id: String(players.length + i),
            })),
          ]
        : players.slice(0, targetCount);
    set({
      settings: { ...settings, use6v6: v },
      players: newPlayers,
      step: 'input',
      teamA: [],
      teamB: [],
      resultA: [],
      resultB: [],
    });
  },
});
