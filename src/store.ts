import { create } from 'zustand';
import type { Player, AssignedPlayer, AppStep, AppSettings, Role } from './types';
import { HEROES } from './data/heroes';

function makeDefaultPlayers(count = 10): Player[] {
  return Array.from({ length: count }, (_, i) => ({
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
  settings: { useMost: false, useBan: false, use6v6: false },
  players: makeDefaultPlayers(),
  teamA: [],
  teamB: [],
  resultA: [],
  resultB: [],
  showSettings: false,
  showPreset: false,

  setStep: (step) => set({ step }),
  setSettings: (s) => set((state) => {
    const next = { ...state.settings, ...s };
    if (s.use6v6 !== undefined && s.use6v6 !== state.settings.use6v6) {
      const targetCount = s.use6v6 ? 12 : 10;
      const currentPlayers = state.players;
      const newPlayers =
        targetCount > currentPlayers.length
          ? [...currentPlayers, ...makeDefaultPlayers(targetCount - currentPlayers.length).map((p, i) => ({ ...p, id: String(currentPlayers.length + i) }))]
          : currentPlayers.slice(0, targetCount);
      return { settings: next, players: newPlayers, step: 'input', teamA: [], teamB: [], resultA: [], resultB: [] };
    }
    return { settings: next };
  }),
  setPlayers: (players) => set({ players }),
  confirmTeams: (teamA, teamB) => set({ teamA, teamB, step: 'result', resultA: [], resultB: [] }),
  setResult: (resultA, resultB) => set({ resultA, resultB }),
  setShowSettings: (showSettings) => set({ showSettings }),
  setShowPreset: (showPreset) => set({ showPreset }),
  reset: () => set((state) => ({
    step: 'input',
    players: makeDefaultPlayers(state.settings.use6v6 ? 12 : 10),
    teamA: [],
    teamB: [],
    resultA: [],
    resultB: [],
  })),
}));
