import { useState } from 'react';
import type { Player, Role, HeroMost } from '../types';
import { HEROES } from '../data/heroes';
import './PlayerInputForm.css';

const ROLE_LABELS: Record<Role, string> = { tank: '탱커', dps: '딜러', heal: '힐러' };
const ROLES: Role[] = ['tank', 'dps', 'heal'];

interface Props {
  players: Player[];
  onChange: (players: Player[]) => void;
  onNext: () => void;
}

export default function PlayerInputForm({ players, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setPlayer = (index: number, updated: Player) => {
    const next = [...players];
    next[index] = updated;
    onChange(next);
  };

  const setHero = (playerIdx: number, role: Role, rank: 0 | 1 | 2, hero: string) => {
    const player = players[playerIdx];
    const newMost: HeroMost = {
      ...player.most,
      [role]: player.most[role].map((h, i) => (i === rank ? hero : h)) as [string, string, string],
    };
    setPlayer(playerIdx, { ...player, most: newMost });
  };

  const toggleBan = (playerIdx: number, role: Role) => {
    const player = players[playerIdx];
    const banned = player.banned.includes(role)
      ? player.banned.filter(r => r !== role)
      : [...player.banned, role];
    setPlayer(playerIdx, { ...player, banned });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    players.forEach((p, i) => {
      if (!p.name.trim()) newErrors[`name_${i}`] = '이름을 입력하세요';
      if (p.banned.length >= 3) newErrors[`ban_${i}`] = '모든 역할을 밴할 수 없어요';
      ROLES.forEach(role => {
        const picks = p.most[role];
        if (new Set(picks).size !== 3) newErrors[`most_${i}_${role}`] = '모스트 3개를 모두 다르게 선택하세요';
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="player-input-form">
      <h2 className="section-title">플레이어 정보 입력</h2>
      <p className="section-desc">닉네임, 포지션별 모스트 영웅, 밴 포지션을 입력하세요.</p>
      <div className="players-grid">
        {players.map((player, i) => (
          <div key={player.id} className="player-card">
            <div className="player-number">#{i + 1}</div>

            <div className="field">
              <label>닉네임</label>
              <input
                type="text"
                value={player.name}
                placeholder="닉네임 입력"
                onChange={e => setPlayer(i, { ...player, name: e.target.value })}
                className={errors[`name_${i}`] ? 'error' : ''}
              />
              {errors[`name_${i}`] && <span className="error-msg">{errors[`name_${i}`]}</span>}
            </div>

            {ROLES.map(role => (
              <div key={role} className="field">
                <label className={`role-label role-${role}`}>{ROLE_LABELS[role]} 모스트</label>
                <div className="hero-selects">
                  {([0, 1, 2] as const).map(rank => (
                    <div key={rank} className="hero-select-wrap">
                      <span className="rank-label">{rank + 1}</span>
                      <select
                        value={player.most[role][rank]}
                        onChange={e => setHero(i, role, rank, e.target.value)}
                        className={`hero-select role-select-${role}`}
                      >
                        {HEROES[role].map(hero => (
                          <option key={hero} value={hero}>{hero}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                {errors[`most_${i}_${role}`] && (
                  <span className="error-msg">{errors[`most_${i}_${role}`]}</span>
                )}
              </div>
            ))}

            <div className="field">
              <label>역할 밴 <span className="label-hint">(너무 잘해서 제외할 역할)</span></label>
              <div className="ban-buttons">
                {ROLES.map(role => (
                  <button
                    key={role}
                    className={`ban-btn role-${role} ${player.banned.includes(role) ? 'banned' : ''}`}
                    onClick={() => toggleBan(i, role)}
                  >
                    {player.banned.includes(role) ? '🚫 ' : ''}{ROLE_LABELS[role]}
                  </button>
                ))}
              </div>
              {errors[`ban_${i}`] && <span className="error-msg">{errors[`ban_${i}`]}</span>}
            </div>
          </div>
        ))}
      </div>
      <button className="primary-btn" onClick={() => { if (validate()) onNext(); }}>
        팀 나누기 →
      </button>
    </div>
  );
}
