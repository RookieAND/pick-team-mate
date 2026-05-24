import type { Preset, Player } from '../types';

const KEY = 'ptm_presets';
const MAX = 5;

export function loadPresets(): Preset[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function savePreset(players: Player[]): Preset {
  const presets = loadPresets();
  const now = Date.now();
  const d = new Date(now);
  const name = `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const preset: Preset = { id: crypto.randomUUID(), name, savedAt: now, players };
  const next = [preset, ...presets].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
  return preset;
}

export function deletePreset(id: string): Preset[] {
  const next = loadPresets().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
