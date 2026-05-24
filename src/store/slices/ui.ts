import type { StateCreator } from 'zustand';
import type { AppState, UISlice } from '../state';

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set) => ({
  showSettings: false,
  showPreset: false,

  setShowSettings: (v) => set({ showSettings: v }),
  setShowPreset: (v) => set({ showPreset: v }),
});
