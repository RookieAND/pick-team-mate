import { useState, useCallback } from 'react';
import type { Player } from '../types';
import './TeamSplit.css';

interface Props {
  players: Player[];
  onConfirm: (teamA: Player[], teamB: Player[]) => void;
  onBack: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TeamSplit({ players, onConfirm, onBack }: Props) {
  const split = useCallback(() => {
    const shuffled = shuffle(players);
    return { teamA: shuffled.slice(0, 5), teamB: shuffled.slice(5, 10) };
  }, [players]);

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
    <div className="team-split">
      <h2 className="section-title">팀 배정</h2>
      <p className="section-desc">랜덤으로 5:5 팀이 나뉘었습니다. 마음에 들지 않으면 다시 섞어보세요.</p>

      <div className={`teams-display ${spinning ? 'spinning' : ''}`}>
        {(['A', 'B'] as const).map((label, idx) => {
          const team = idx === 0 ? teams.teamA : teams.teamB;
          return (
            <div key={label} className={`team-box team-${label.toLowerCase()}`}>
              <div className="team-header">팀 {label}</div>
              <ul className="team-list">
                {team.map(p => (
                  <li key={p.id} className="team-member">
                    <span className="member-name">{p.name || '(이름 없음)'}</span>
                    <span className="member-mosts">
                      {p.most.map((r, i) => (
                        <span key={i} className={`role-badge role-${r}`}>
                          {r === 'tank' ? '탱' : r === 'dps' ? '딜' : '힐'}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="action-row">
        <button className="secondary-btn" onClick={onBack}>← 돌아가기</button>
        <button className="ghost-btn" onClick={reshuffle} disabled={spinning}>🔀 다시 섞기</button>
        <button className="primary-btn" onClick={() => onConfirm(teams.teamA, teams.teamB)}>
          역할 배정 시작 →
        </button>
      </div>
    </div>
  );
}
