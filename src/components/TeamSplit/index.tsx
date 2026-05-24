import { useState, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { Player } from '../../types';
import { useAppStore } from '../../store';
import RoleBadge from '../RoleBadge';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TeamSplit() {
  const { players, settings, confirmTeams, setStep } = useAppStore(
    useShallow((s) => ({
      players: s.players,
      settings: s.settings,
      confirmTeams: s.confirmTeams,
      setStep: s.setStep,
    }))
  );

  const half = Math.floor(players.length / 2);
  const split = useCallback(() => {
    const shuffled = shuffle(players);
    return { teamA: shuffled.slice(0, half), teamB: shuffled.slice(half) };
  }, [players, half]);

  const [teams, setTeams] = useState(split);
  const [spinning, setSpinning] = useState(false);

  const reshuffle = () => {
    setSpinning(true);
    setTimeout(() => {
      setTeams(split());
      setSpinning(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-3xl flex flex-col">
      <div className="px-6 pt-8 pb-4 flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="section-title">팀 배정</h2>
          <p className="section-desc mt-1">
            랜덤으로 {half}:{half} 팀이 나뉘었습니다. 마음에 들지 않으면 다시 섞어보세요.
          </p>
        </div>

        <div
          className={`grid grid-cols-2 gap-4 w-full transition-opacity duration-300 ${spinning ? 'opacity-30' : ''}`}
        >
          {(['A', 'B'] as const).map((label, idx) => {
            const team = idx === 0 ? teams.teamA : teams.teamB;
            return (
              <div
                key={label}
                className={`card overflow-hidden ${label === 'A' ? 'border-t-2 border-t-purple!' : 'border-t-2 border-t-violet!'}`}
              >
                <div className="px-4 py-3 font-bold text-[0.95rem] text-lilac bg-[#14142a] border-b border-line">
                  팀 {label}
                </div>
                <ul className="flex flex-col">
                  {team.map((p: Player) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 px-4 py-2.5 border-b border-line/60 last:border-0"
                    >
                      <span className="flex-1 font-semibold text-[0.9rem]">
                        {p.name || '(이름 없음)'}
                      </span>
                      {settings.useMost && (
                        <div className="flex gap-1">
                          <RoleBadge role="tank">{p.most.tank[0]}</RoleBadge>
                          <RoleBadge role="dps">{p.most.dps[0]}</RoleBadge>
                          <RoleBadge role="heal">{p.most.heal[0]}</RoleBadge>
                        </div>
                      )}
                      {settings.useBan && p.banned.length > 0 && (
                        <div className="flex gap-1">
                          {p.banned.map((role) => (
                            <RoleBadge
                              key={role}
                              role={role}
                              size="sm"
                              className="opacity-60 line-through"
                            >
                              🚫{role === 'tank' ? '탱' : role === 'dps' ? '딜' : '힐'}
                            </RoleBadge>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 w-full bg-base/95 backdrop-blur-sm border-t border-line/20 px-6 py-4 flex gap-3 flex-wrap justify-center">
        <button className="btn-secondary py-[14px]! px-7!" onClick={() => setStep('input')}>
          ← 돌아가기
        </button>
        <button className="btn-ghost py-[14px]! px-6!" onClick={reshuffle} disabled={spinning}>
          🔀 다시 섞기
        </button>
        <button
          className="btn-primary py-[17px]! px-12! text-[1.05rem]!"
          onClick={() => confirmTeams(teams.teamA, teams.teamB)}
        >
          역할 배정 시작 →
        </button>
      </div>
    </div>
  );
}
