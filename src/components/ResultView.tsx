import { useRef, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import html2canvas from 'html2canvas';
import type { AssignedPlayer, Role } from '../types';
import { useAppStore } from '../store';
import MapPicker from './MapPicker';
import './ResultView.css';

const ROLE_LABELS: Record<Role, string> = { tank: '탱커', dps: '딜러', heal: '힐러' };
const ROLE_ORDER: Role[] = ['tank', 'heal', 'dps'];

function sortByRole(players: AssignedPlayer[]) {
  return [...players].sort(
    (a, b) => ROLE_ORDER.indexOf(a.assignedRole) - ROLE_ORDER.indexOf(b.assignedRole)
  );
}

function TeamResult({ players, label, showMost, showBan }: {
  players: AssignedPlayer[]; label: string; showMost: boolean; showBan: boolean;
}) {
  const sorted = sortByRole(players);
  return (
    <div className="team-result">
      <div className="result-team-header">팀 {label}</div>
      <div className="result-players">
        {sorted.map(p => (
          <div key={p.id} className={`result-player role-bg-${p.assignedRole}`}>
            <span className={`result-role role-${p.assignedRole}`}>
              {ROLE_LABELS[p.assignedRole]}
            </span>
            <span className="result-name">{p.name}</span>
            <span className="result-badges">
              {showMost && p.most[p.assignedRole].map((hero, i) => (
                <span key={i} className={`mini-badge role-${p.assignedRole}`}>{hero}</span>
              ))}
              {showBan && p.banned.length > 0 && p.banned.map(role => (
                <span key={role} className="ban-badge">🚫{ROLE_LABELS[role]}</span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultView() {
  const { resultA, resultB, settings, reset } = useAppStore(useShallow(s => ({
    resultA: s.resultA,
    resultB: s.resultB,
    settings: s.settings,
    reset: s.reset,
  })));

  const captureRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const download = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current, {
      backgroundColor: '#0f0f1a',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = 'team-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div ref={viewRef} className="result-view">
      <h2 className="section-title">배정 완료!</h2>
      <p className="section-desc">모든 팀원의 역할이 배정되었습니다.</p>

      <div className="result-capture">
        <div ref={captureRef} className="result-teams">
          <TeamResult players={resultA} label="A" showMost={settings.useMost} showBan={settings.useBan} />
          <TeamResult players={resultB} label="B" showMost={settings.useMost} showBan={settings.useBan} />
        </div>
        <MapPicker teamAName="팀 A" teamBName="팀 B" />
      </div>

      <div className="result-actions">
        <button className="download-btn" onClick={download}>📷 이미지 저장</button>
        <button className="reset-btn" onClick={reset}>처음부터 다시 →</button>
      </div>
    </div>
  );
}
