import type { Player, AssignedPlayer, AppStep, AppSettings, PlayedMap, MapSettings } from '../types';

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
  confirmRoles: (a: AssignedPlayer[], b: AssignedPlayer[]) => void;
  reset: () => void;
}

export interface MapSlice {
  mapHistory: PlayedMap[];
  mapSettings: MapSettings;
  addPlayedMap: (entry: Omit<PlayedMap, 'id' | 'playedAt'>) => void;
  updateMapWinner: (id: string, winner: PlayedMap['winner']) => void;
  setMapSettings: (patch: Partial<MapSettings>) => void;
  clearMapHistory: () => void;
}

export interface UISlice {
  showSettings: boolean;
  showPreset: boolean;
  setShowSettings: (v: boolean) => void;
  setShowPreset: (v: boolean) => void;
}

export type AppState = SettingsSlice & PlayersSlice & GameSlice & MapSlice & UISlice;
