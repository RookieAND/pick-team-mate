import type { Player, AssignedPlayer, AppStep, AppSettings } from '../types';

export interface SettingsSlice {
  settings: AppSettings;
  setUseMost: (v: boolean) => void;
  setUseBan: (v: boolean) => void;
  setUse6v6: (v: boolean) => void;
}

export interface PlayersSlice {
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

export interface GameSlice {
  step: AppStep;
  teamA: Player[];
  teamB: Player[];
  resultA: AssignedPlayer[];
  resultB: AssignedPlayer[];
  setStep: (step: AppStep) => void;
  confirmTeams: (a: Player[], b: Player[]) => void;
  setResult: (a: AssignedPlayer[], b: AssignedPlayer[]) => void;
  reset: () => void;
}

export interface UISlice {
  showSettings: boolean;
  showPreset: boolean;
  setShowSettings: (v: boolean) => void;
  setShowPreset: (v: boolean) => void;
}

export type AppState = SettingsSlice & PlayersSlice & GameSlice & UISlice;
