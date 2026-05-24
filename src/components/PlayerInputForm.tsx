import { useState } from 'react';
import type { Player, Role } from '../types';
import './PlayerInputForm.css';

const ROLE_LABELS: Record<Role, string> = { tank: '탱', dps: '딜', heal: '힐' };
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

  const toggleBan = (playerIndex: number, role: Role) => {
    const player = players[playerIndex];
    const banned = player.banned.includes(role)
      ? player.banned.filter(r => r !== role)
      : [...player.banned, role];
    setPlayer(playerIndex, { ...player, banned });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    players.forEach((p, i) => {
      if (!p.name.trim()) newErrors[`name_${i}`] = '이름을 입력하세요';
      const mostSet = new Set(p.most);
      if (mostSet.size !== 3) newErrors[`most_${i}`] = '모스트 3개를 모두 다르게 선택하세요';
      if (p.banned.length >= 3) newErrors[`ban_${i}`] = '모든 역할을 밴할 수 없어요';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="player-input-form">
      <h2 className="section-title">플레이어 정보 입력</h2>
      <p className="section-desc">10명의 닉네임, 모스트 역할, 밴 역할을 입력하세요.</p>
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
            <div className="field">
              <label>모스트 역할 순서</label>
              <div className="most-selects">
                {([0, 1, 2] as const).map(rank => (
                  <div key={rank} className="most-select-wrap">
                    <span className="rank-label">모스트{rank + 1}</span>
                    <div className="role-buttons">
                      {ROLES.map(role => (
                        <button
                          key={role}
                          className={`role-btn role-${role} ${player.most[rank] === role ? 'active' : ''}`}
                          onClick={() => {
                            const newMost = [...player.most] as [Role, Role, Role];
                            newMost[rank] = role;
                            setPlayer(i, { ...player, most: newMost });
                          }}
                        >
                          {ROLE_LABELS[role]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {errors[`most_${i}`] && <span className="error-msg">{errors[`most_${i}`]}</span>}
            </div>
            <div className="field">
              <label>역할 밴 <span className="label-hint">(하기 싫은 역할 선택)</span></label>
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
      <button className="primary-btn" onClick={handleNext}>
        팀 나누기 →
      </button>
    </div>
  );
}
