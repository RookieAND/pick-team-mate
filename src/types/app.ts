export type AppStep = 'intro' | 'input' | 'teams' | 'result' | 'map' | 'done';

export interface AppSettings {
  useMost: boolean;
  useBan: boolean;
  use6v6: boolean;
}
