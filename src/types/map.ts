export type MapMode = '점령' | '호위' | '혼합' | '밀기' | '플래시포인트' | '섬멸';

export interface OWMap {
  name: string;
  mode: MapMode;
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
