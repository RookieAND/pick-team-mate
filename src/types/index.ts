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

export type AppStep = 'intro' | 'input' | 'teams' | 'result';

export interface AppSettings {
  useMost: boolean;
  useBan: boolean;
}

export interface Preset {
  id: string;
  name: string;
  savedAt: number;
  players: Player[];
}
