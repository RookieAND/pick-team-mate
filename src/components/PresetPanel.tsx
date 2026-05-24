import { useState } from 'react';
import type { Player, Preset } from '../types';
import { loadPresets, savePreset, deletePreset } from '../utils/presets';
import './PresetPanel.css';

interface Props {
  players: Player[];
  onLoad: (players: Player[]) => void;
}

export default function PresetPanel({ players, onLoad }: Props) {
  const [presets, setPresets] = useState<Preset[]>(loadPresets);

  const handleSave = () => {
    savePreset(players);
    setPresets(loadPresets());
  };

  const handleDelete = (id: string) => {
    setPresets(deletePreset(id));
  };

  return (
    <div className="preset-panel">
      <div className="preset-header">
        <span className="preset-title">프리셋</span>
        <button className="preset-save-btn" onClick={handleSave}>현재 저장</button>
      </div>

      {presets.length === 0 ? (
        <p className="preset-empty">저장된 프리셋이 없습니다</p>
      ) : (
        <ul className="preset-list">
          {presets.map(p => (
            <li key={p.id} className="preset-item">
              <span className="preset-name">{p.name}</span>
              <div className="preset-actions">
                <button className="preset-load-btn" onClick={() => onLoad(p.players)}>불러오기</button>
                <button className="preset-delete-btn" onClick={() => handleDelete(p.id)}>✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
