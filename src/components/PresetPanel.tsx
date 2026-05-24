import { useState } from 'react';
import type { Player, Preset } from '../types';
import { loadPresets, savePreset, deletePreset } from '../utils/presets';

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
    <div className="card-dark w-full px-3.5 py-3">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[0.82rem] font-bold text-lavender">프리셋</span>
        <button
          className="bg-deep-indigo border border-indigo text-lilac text-[0.75rem] px-2.5 py-1 rounded-md cursor-pointer transition-all hover:bg-[#2e1f6e] hover:border-purple font-[inherit]"
          onClick={handleSave}
        >
          현재 저장
        </button>
      </div>

      {presets.length === 0 ? (
        <p className="text-[0.75rem] text-faint text-center py-1.5">저장된 프리셋이 없습니다</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {presets.map(p => (
            <li key={p.id} className="flex items-center justify-between bg-[#13132a] border border-line rounded-lg px-2.5 py-1.5 gap-2">
              <span className="text-[0.8rem] text-sub flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {p.name}
              </span>
              <div className="flex gap-1.5 shrink-0">
                <button
                  className="bg-deep-indigo border border-indigo text-lilac text-[0.73rem] px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-[#2e1f6e] font-[inherit]"
                  onClick={() => onLoad(p.players)}
                >
                  불러오기
                </button>
                <button
                  className="bg-transparent border border-[#3a2a2a] text-dim text-[0.7rem] px-1.5 py-0.5 rounded cursor-pointer transition-all hover:text-dps hover:border-dps font-[inherit] leading-none"
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
