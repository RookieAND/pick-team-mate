import { useState, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { Player } from '../types';
import { useAppStore } from '../store';
import './TeamSplit.css';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TeamSplit() {
  const { players, settings, confirmTeams, setStep } = useAppStore(useShallow(s => ({
    players: s.players,
    settings: s.settings,
    confirmTeams: s.confirmTeams,
    setStep: s.setStep,
  })));

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
                {team.map((p: Player) => (
                  <li key={p.id} className="team-member">
                    <span className="member-name">{p.name || '(이름 없음)'}</span>
                    {settings.useMost && (
                      <span className="member-mosts">
                        <span className="role-badge role-tank">{p.most.tank[0]}</span>
                        <span className="role-badge role-dps">{p.most.dps[0]}</span>
                        <span className="role-badge role-heal">{p.most.heal[0]}</span>
                      </span>
                    )}
                    {settings.useBan && p.banned.length > 0 && (
                      <span className="member-bans">
                        {p.banned.map(role => (
                          <span key={role} className="ban-badge">🚫{role === 'tank' ? '탱' : role === 'dps' ? '딜' : '힐'}</span>
                        ))}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="action-row">
        <button className="secondary-btn" onClick={() => setStep('input')}>← 돌아가기</button>
        <button className="ghost-btn" onClick={reshuffle} disabled={spinning}>🔀 다시 섞기</button>
        <button className="primary-btn" onClick={() => confirmTeams(teams.teamA, teams.teamB)}>
          역할 배정 시작 →
        </button>
      </div>
    </div>
  );
}
