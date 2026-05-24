import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { Player } from '../../types';
import { useAppStore } from '../../store';
import PlayerCard from './PlayerCard';

export default function PlayerInputForm() {
  const { players, settings, setPlayers, setStep } = useAppStore(
    useShallow((s) => ({
      players: s.players,
      settings: s.settings,
      setPlayers: s.setPlayers,
      setStep: s.setStep,
    }))
  );

  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const [error, setError] = useState('');

  const setPlayer = (index: number, updated: Player) => {
    const next = [...players];
    next[index] = updated;
    setPlayers(next);
  };

  const validate = () => {
    const empty = players.filter((p) => !p.name.trim());
    if (empty.length > 0) {
      setError(`${empty.length}명의 닉네임이 비어있습니다.`);
      return false;
    }
    setError('');
    return true;
  };

  const totalCount = players.length;
  const filledCount = players.filter((p) => p.name.trim()).length;

  return (
    <div className="w-full max-w-[680px] flex flex-col">
      <div className="px-5 pt-6 pb-4 flex flex-col items-center gap-4">
        <div className="w-full flex flex-col items-end gap-1">
          <div className="w-full h-1 bg-[#1f1f38] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${(filledCount / totalCount) * 100}%`,
                background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
              }}
            />
          </div>
          <span className="text-[0.75rem] text-muted">
            {filledCount} / {totalCount} 입력 완료
          </span>
        </div>

        <div className="w-full flex flex-col gap-1.5">
          {players.map((player, i) => (
            <PlayerCard
              key={player.id}
              player={player}
              index={i}
              useMost={settings.useMost}
              useBan={settings.useBan}
              onChange={(p) => setPlayer(i, p)}
              isActive={activeIdx === i}
              onSelect={() => setActiveIdx(activeIdx === i ? null : i)}
              onTabNext={() => setActiveIdx(i < totalCount - 1 ? i + 1 : null)}
              onTabPrev={() => setActiveIdx(i > 0 ? i - 1 : null)}
            />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 w-full bg-base border-t border-line/40 px-5 py-4 flex flex-col items-center gap-2">
        {error && <p className="text-[0.82rem] text-danger text-center">{error}</p>}
        <button
          className="btn-primary"
          disabled={filledCount < totalCount}
          onClick={() => {
            if (validate()) setStep('teams');
          }}
        >
          팀 나누기 →
        </button>
      </div>
    </div>
  );
}
