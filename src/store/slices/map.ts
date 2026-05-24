import { nanoid } from 'nanoid';
import type { StateCreator } from 'zustand';
import type { AppState, MapSlice } from '../state';

export const createMapSlice: StateCreator<AppState, [], [], MapSlice> = (set) => ({
  mapHistory: [],
  mapSettings: {
    preventDuplicates: false,
    excludedModes: [],
  },

  addPlayedMap: (entry) =>
    set((s) => ({
      mapHistory: [
        ...s.mapHistory,
        { ...entry, id: nanoid(), playedAt: Date.now() },
      ],
    })),

  updateMapWinner: (id, winner) =>
    set((s) => ({
      mapHistory: s.mapHistory.map((m) => (m.id === id ? { ...m, winner } : m)),
    })),

  setMapSettings: (patch) =>
    set((s) => ({ mapSettings: { ...s.mapSettings, ...patch } })),

  clearMapHistory: () => set({ mapHistory: [] }),
});
