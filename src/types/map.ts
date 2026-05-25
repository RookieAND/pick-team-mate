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
