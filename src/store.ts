import { create } from 'zustand';
import type { Player, AssignedPlayer, AppStep, AppSettings, Role } from './types';
import { HEROES } from './data/heroes';

function makeDefaultPlayers(): Player[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: String(i),
    name: '',
    most: {
      tank: [HEROES.tank[0], HEROES.tank[1], HEROES.tank[2]],
      dps: [HEROES.dps[0], HEROES.dps[1], HEROES.dps[2]],
      heal: [HEROES.heal[0], HEROES.heal[1], HEROES.heal[2]],
    },
    banned: [] as Role[],
  }));
}

interface AppState {
  step: AppStep;
  settings: AppSettings;
  players: Player[];
  teamA: Player[];
  teamB: Player[];
  resultA: AssignedPlayer[];
  resultB: AssignedPlayer[];
  showSettings: boolean;
  showPreset: boolean;

  setStep: (step: AppStep) => void;
  setSettings: (s: Partial<AppSettings>) => void;
  setPlayers: (players: Player[]) => void;
  confirmTeams: (a: Player[], b: Player[]) => void;
  setResult: (a: AssignedPlayer[], b: AssignedPlayer[]) => void;
  setShowSettings: (v: boolean) => void;
  setShowPreset: (v: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  step: 'intro',
  settings: { useMost: true, useBan: true },
  players: makeDefaultPlayers(),
  teamA: [],
  teamB: [],
  resultA: [],
  resultB: [],
  showSettings: false,
  showPreset: false,

  setStep: (step) => set({ step }),
  setSettings: (s) => set((state) => ({ settings: { ...state.settings, ...s } })),
  setPlayers: (players) => set({ players }),
  confirmTeams: (teamA, teamB) => set({ teamA, teamB, step: 'result', resultA: [], resultB: [] }),
  setResult: (resultA, resultB) => set({ resultA, resultB }),
  setShowSettings: (showSettings) => set({ showSettings }),
  setShowPreset: (showPreset) => set({ showPreset }),
  reset: () => set({
    step: 'input',
    players: makeDefaultPlayers(),
    teamA: [],
    teamB: [],
    resultA: [],
    resultB: [],
  }),
}));
