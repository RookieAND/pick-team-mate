export type Role = 'tank' | 'dps' | 'heal';

export interface Player {
  id: string;
  name: string;
  most: [Role, Role, Role];
  banned: Role[];
}

export interface AssignedPlayer extends Player {
  assignedRole: Role;
}

export interface Team {
  players: AssignedPlayer[];
}

export type AppStep = 'input' | 'teams' | 'result';
