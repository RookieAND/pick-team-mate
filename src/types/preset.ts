import type { Player } from './player';

export interface Preset {
  id: string;
  name: string;
  savedAt: number;
  players: Player[];
}
