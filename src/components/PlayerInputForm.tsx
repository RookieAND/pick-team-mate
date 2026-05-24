import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { Player, Role, HeroMost } from '../types';
import { HEROES } from '../data/heroes';
import { useAppStore } from '../store';
import SearchableSelect from './SearchableSelect';

const ROLE_LABELS: Record<Role, string> = { tank: '탱커', dps: '딜러', heal: '힐러' };
const ROLES: Role[] = ['tank', 'dps', 'heal'];

function PlayerCard({
  player, index, useMost, useBan,
  onChange, isActive, onSelect, onTabNext, onTabPrev,
}: {
  player: Player; index: number; useMost: boolean; useBan: boolean;
  onChange: (p: Player) => void; isActive: boolean; onSelect: () => void;
  onTabNext: () => void; onTabPrev: () => void;
}) {
  const setHero = (role: Role, rank: 0 | 1 | 2, hero: string) => {
    const newMost: HeroMost = {
      ...player.most,
      [role]: player.most[role].map((h, i) => (i === rank ? hero : h)) as [string, string, string],
    };
    onChange({ ...player, most: newMost });
  };

  const toggleBan = (role: Role) => {
    const banned = player.banned.includes(role)
      ? player.banned.filter(r => r !== role)
      : [...player.banned, role];
    onChange({ ...player, banned });
  };

  const filled = player.name.trim().length > 0;

  return (
    <div className={`card overflow-hidden transition-colors ${isActive ? 'border-purple!' : ''} ${filled && !isActive ? 'border-line-strong!' : ''}`}>
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-transparent hover:bg-white/[0.03] transition-colors text-left"
        onClick={onSelect}
      >
        <span className="text-[0.72rem] text-faint font-bold min-w-7">#{index + 1}</span>

        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-[0.62rem] text-faint font-bold shrink-0">[닉네임]</span>
          <span className={`text-[0.88rem] font-semibold truncate ${filled ? 'text-lilac' : 'text-faint'}`}>
            {player.name || '미입력'}
          </span>
        </div>

        {useMost && filled && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[0.62rem] text-faint font-bold">[모스트]</span>
            <div className="flex gap-1">
              <span className="badge-sm-tank">{player.most.tank[0]}</span>
              <span className="badge-sm-dps">{player.most.dps[0]}</span>
              <span className="badge-sm-heal">{player.most.heal[0]}</span>
            </div>
          </div>
        )}

        {useBan && player.banned.length > 0 && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[0.62rem] text-faint font-bold">[밴]</span>
            <div className="flex gap-1">
              {player.banned.map(role => (
                <span key={role} className="badge-ban">
                  {role === 'tank' ? '탱' : role === 'dps' ? '딜' : '힐'}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          {filled && <span className="text-[0.75rem] text-purple font-bold">✓</span>}
          <span className="text-[0.65rem] text-faint">{isActive ? '▲' : '▼'}</span>
        </div>
      </button>

      {isActive && (
        <div className="flex flex-col gap-3 px-4 pb-4 border-t border-line">
          <div className="flex flex-col gap-1.5 pt-3">
            <label className="text-[0.73rem] text-muted font-bold uppercase tracking-wide">닉네임</label>
            <input
              type="text"
              className="field-input"
              value={player.name}
              placeholder="닉네임 입력"
              autoFocus
              onChange={e => onChange({ ...player, name: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  e.shiftKey ? onTabPrev() : onTabNext();
                }
              }}
            />
          </div>

          {useMost && (
            <div className="flex flex-col gap-2.5 pt-1">
              {ROLES.map(role => (
                <div key={role} className="flex items-center gap-2.5">
                  <span className={`badge-${role} min-w-9 text-center`}>{ROLE_LABELS[role]}</span>
                  <div className="flex-1 flex gap-1.5">
                    {([0, 1, 2] as const).map(rank => (
                      <div key={rank} className="flex-1 flex items-center gap-1">
                        <span className="text-[0.65rem] text-faint font-bold">{rank + 1}</span>
                        <SearchableSelect
                          value={player.most[role][rank]}
                          options={HEROES[role]}
                          roleClass={`role-${role}`}
                          onChange={v => setHero(role, rank, v)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {useBan && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.73rem] text-muted font-bold uppercase tracking-wide flex items-center gap-1.5">
                역할 밴 <span className="text-[0.68rem] text-faint font-normal normal-case tracking-normal">너무 잘해서 제외</span>
              </label>
              <div className="flex gap-2">
                {ROLES.map(role => (
                  <button
                    key={role}
                    className={`ban-btn ban-btn-${role} ${player.banned.includes(role) ? 'banned' : ''}`}
                    onClick={() => toggleBan(role)}
                  >
                    {player.banned.includes(role) ? '🚫 ' : ''}{ROLE_LABELS[role]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlayerInputForm() {
  const { players, settings, setPlayers, setStep } = useAppStore(useShallow(s => ({
    players: s.players,
    settings: s.settings,
    setPlayers: s.setPlayers,
    setStep: s.setStep,
  })));

  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const [error, setError] = useState('');

  const setPlayer = (index: number, updated: Player) => {
    const next = [...players];
    next[index] = updated;
    setPlayers(next);
  };

  const validate = () => {
    const empty = players.filter(p => !p.name.trim());
    if (empty.length > 0) { setError(`${empty.length}명의 닉네임이 비어있습니다.`); return false; }
    if (players.some(p => p.banned.length >= 3)) { setError('모든 역할을 밴한 플레이어가 있습니다.'); return false; }
    setError('');
    return true;
  };

  const totalCount = players.length;
  const filledCount = players.filter(p => p.name.trim()).length;

  return (
    <div className="w-full max-w-[680px] px-5 pt-6 pb-8 flex flex-col items-center gap-4">
      <div className="w-full flex flex-col items-end gap-1">
        <div className="w-full h-1 bg-[#1f1f38] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{ width: `${(filledCount / totalCount) * 100}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
          />
        </div>
        <span className="text-[0.75rem] text-muted">{filledCount} / {totalCount} 입력 완료</span>
      </div>

      <div className="w-full flex flex-col gap-1.5">
        {players.map((player, i) => (
          <PlayerCard
            key={player.id}
            player={player}
            index={i}
            useMost={settings.useMost}
            useBan={settings.useBan}
            onChange={p => setPlayer(i, p)}
            isActive={activeIdx === i}
            onSelect={() => setActiveIdx(activeIdx === i ? null : i)}
            onTabNext={() => setActiveIdx(i < totalCount - 1 ? i + 1 : null)}
            onTabPrev={() => setActiveIdx(i > 0 ? i - 1 : null)}
          />
        ))}
      </div>

      {error && <p className="text-[0.82rem] text-danger text-center">{error}</p>}

      <button
        className="btn-primary mt-1"
        disabled={filledCount < totalCount}
        onClick={() => { if (validate()) setStep('teams'); }}
      >
        팀 나누기 →
      </button>
    </div>
  );
}
