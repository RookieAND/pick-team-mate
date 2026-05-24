export type Role = 'tank' | 'dps' | 'heal';

export interface HeroMost {
  tank: [string, string, string];
  dps: [string, string, string];
  heal: [string, string, string];
}

export interface Player {
  id: string;
  name: string;
  most: HeroMost;
  banned: Role[];
}

export interface AssignedPlayer extends Player {
  assignedRole: Role;
}

export type AppStep = 'intro' | 'input' | 'teams' | 'result' | 'map' | 'done';

export interface AppSettings {
  useMost: boolean;
  useBan: boolean;
  use6v6: boolean;
}

export interface PlayedMap {
  id: string;
  name: string;
  mode: string;
  winner: 'A' | 'B' | 'draw' | null;
  side: { first: string; second: string } | null;
  playedAt: number;
}

export interface MapSettings {
  preventDuplicates: boolean;
  excludedModes: string[];
}

export interface Preset {
  id: string;
  name: string;
  savedAt: number;
  players: Player[];
}
