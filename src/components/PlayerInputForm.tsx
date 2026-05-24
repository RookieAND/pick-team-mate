import { useState } from 'react';
import type { Player, Role, HeroMost, AppSettings } from '../types';
import { HEROES } from '../data/heroes';
import './PlayerInputForm.css';

const ROLE_LABELS: Record<Role, string> = { tank: '탱커', dps: '딜러', heal: '힐러' };
const ROLES: Role[] = ['tank', 'dps', 'heal'];

interface Props {
  players: Player[];
  settings: AppSettings;
  onChange: (players: Player[]) => void;
  onNext: () => void;
}

function PlayerCard({
  player, index, settings,
  onChange, isActive, onSelect,
}: {
  player: Player; index: number; settings: AppSettings;
  onChange: (p: Player) => void; isActive: boolean; onSelect: () => void;
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
    <div className={`pcard ${isActive ? 'active' : ''} ${filled ? 'filled' : ''}`}>
      <button className="pcard-header" onClick={onSelect}>
        <span className="pcard-num">#{index + 1}</span>
        <span className="pcard-name">{player.name || '미입력'}</span>
        {filled && <span className="pcard-check">✓</span>}
        <span className="pcard-arrow">{isActive ? '▲' : '▼'}</span>
      </button>

      {isActive && (
        <div className="pcard-body">
          <div className="pfield">
            <label>닉네임</label>
            <input
              type="text"
              value={player.name}
              placeholder="닉네임 입력"
              autoFocus
              onChange={e => onChange({ ...player, name: e.target.value })}
            />
          </div>

          {settings.useMost && (
            <div className="most-section">
              {ROLES.map(role => (
                <div key={role} className={`most-role most-role-${role}`}>
                  <span className={`most-role-label role-${role}`}>{ROLE_LABELS[role]}</span>
                  <div className="most-selects">
                    {([0, 1, 2] as const).map(rank => (
                      <div key={rank} className="hero-select-wrap">
                        <span className="rank-dot">{rank + 1}</span>
                        <select
                          value={player.most[role][rank]}
                          onChange={e => setHero(role, rank, e.target.value)}
                          className={`hero-select role-select-${role}`}
                        >
                          {HEROES[role].map(hero => (
                            <option key={hero} value={hero}>{hero}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {settings.useBan && (
            <div className="pfield">
              <label>역할 밴 <span className="label-hint">너무 잘해서 제외</span></label>
              <div className="ban-buttons">
                {ROLES.map(role => (
                  <button
                    key={role}
                    className={`ban-btn role-${role} ${player.banned.includes(role) ? 'banned' : ''}`}
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

export default function PlayerInputForm({ players, settings, onChange, onNext }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const [error, setError] = useState('');

  const setPlayer = (index: number, updated: Player) => {
    const next = [...players];
    next[index] = updated;
    onChange(next);
  };

  const validate = () => {
    const empty = players.filter(p => !p.name.trim());
    if (empty.length > 0) {
      setError(`${empty.length}명의 닉네임이 비어있습니다.`);
      return false;
    }
    if (players.some(p => p.banned.length >= 3)) {
      setError('모든 역할을 밴한 플레이어가 있습니다.');
      return false;
    }
    setError('');
    return true;
  };

  const filledCount = players.filter(p => p.name.trim()).length;

  return (
    <div className="player-input-form">
      <div className="form-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(filledCount / 10) * 100}%` }} />
        </div>
        <span className="progress-label">{filledCount} / 10 입력 완료</span>
      </div>

      <div className="pcards-list">
        {players.map((player, i) => (
          <PlayerCard
            key={player.id}
            player={player}
            index={i}
            settings={settings}
            onChange={p => setPlayer(i, p)}
            isActive={activeIdx === i}
            onSelect={() => setActiveIdx(activeIdx === i ? null : i)}
          />
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}

      <button
        className={`primary-btn ${filledCount === 10 ? 'ready' : ''}`}
        onClick={() => { if (validate()) onNext(); }}
      >
        팀 나누기 →
      </button>
    </div>
  );
}
