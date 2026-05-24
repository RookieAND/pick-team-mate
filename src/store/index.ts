import { create } from 'zustand';
import type { AppState } from './state';
import { createSettingsSlice } from './slices/settings';
import { createPlayersSlice } from './slices/players';
import { createGameSlice } from './slices/game';
import { createMapSlice } from './slices/map';
import { createUISlice } from './slices/ui';

export const useAppStore = create<AppState>()((...a) => ({
  ...createSettingsSlice(...a),
  ...createPlayersSlice(...a),
  ...createGameSlice(...a),
  ...createMapSlice(...a),
  ...createUISlice(...a),
}));
