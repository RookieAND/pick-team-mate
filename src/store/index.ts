import { create } from 'zustand';
import type { AppState } from './state';
import { createSettingsSlice } from './slices/settings';
import { createPlayersSlice } from './slices/players';
import { createGameSlice } from './slices/game';
import { createUISlice } from './slices/ui';

export const useAppStore = create<AppState>()((...a) => ({
  ...createSettingsSlice(...a),
  ...createPlayersSlice(...a),
  ...createGameSlice(...a),
  ...createUISlice(...a),
}));
