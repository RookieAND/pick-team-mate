import type { Player, Role } from '../types';
import { HEROES } from '../data/heroes';

export function makeDefaultPlayers(count = 10): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i),
    name: '',
    most: {
      tank: [HEROES.tank[0], HEROES.tank[1], HEROES.tank[2]] as [string, string, string],
      dps: [HEROES.dps[0], HEROES.dps[1], HEROES.dps[2]] as [string, string, string],
      heal: [HEROES.heal[0], HEROES.heal[1], HEROES.heal[2]] as [string, string, string],
    },
    banned: [] as Role[],
  }));
}
