import { useState } from 'react';
import type { Player, Preset } from '../../types';
import { loadPresets, savePreset, deletePreset } from '../../utils/presets';

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
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <p className="text-[0.8rem] text-muted">
          {presets.length > 0
            ? `${presets.length}개 저장됨 (최대 5개)`
            : '저장된 프리셋이 없습니다'}
        </p>
        <button
          className="bg-deep-indigo border border-indigo text-lilac text-[0.75rem] px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:bg-[#2e1f6e] hover:border-purple font-[inherit] font-semibold"
          onClick={handleSave}
        >
          + 현재 저장
        </button>
      </div>

      {presets.length > 0 && (
        <ul className="flex flex-col gap-2">
          {presets.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between bg-card border border-line rounded-xl px-3.5 py-3 gap-2"
            >
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-[0.85rem] font-semibold text-text truncate">{p.name}</span>
                <span className="text-[0.7rem] text-faint">
                  {p.players.filter((pl) => pl.name.trim()).length}명 입력됨
                </span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  className="bg-deep-indigo border border-indigo text-lilac text-[0.75rem] px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-[#2e1f6e] font-[inherit] font-semibold"
                  onClick={() => onLoad(p.players)}
                >
                  불러오기
                </button>
                <button
                  className="bg-transparent border border-[#3a2a2a] text-dim text-[0.75rem] w-8 h-8 rounded-lg cursor-pointer transition-all hover:text-dps hover:border-dps font-[inherit] flex items-center justify-center"
                  onClick={() => handleDelete(p.id)}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
