import { useRef, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import html2canvas from 'html2canvas';
import type { AssignedPlayer, Role } from '../types';
import { useAppStore } from '../store';
import MapPicker from './MapPicker';

const ROLE_LABELS: Record<Role, string> = { tank: '탱커', dps: '딜러', heal: '힐러' };
const ROLE_ORDER: Role[] = ['tank', 'heal', 'dps'];

function sortByRole(players: AssignedPlayer[]) {
  return [...players].sort(
    (a, b) => ROLE_ORDER.indexOf(a.assignedRole) - ROLE_ORDER.indexOf(b.assignedRole)
  );
}

function TeamResult({
  players,
  label,
  showMost,
  showBan,
}: {
  players: AssignedPlayer[];
  label: string;
  showMost: boolean;
  showBan: boolean;
}) {
  const sorted = sortByRole(players);
  const borderColor: Record<Role, string> = {
    tank: 'var(--color-tank)',
    dps: 'var(--color-dps)',
    heal: 'var(--color-heal)',
  };
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 font-bold text-[0.95rem] text-lilac bg-[#14142a] border-b border-line">
        팀 {label}
      </div>
      <div className="flex flex-col">
        {sorted.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[#1f1f38] last:border-0 hover:bg-white/[0.02] transition-colors"
            style={{ borderLeft: `3px solid ${borderColor[p.assignedRole]}` }}
          >
            <span className={`badge-${p.assignedRole} min-w-10 text-center`}>
              {ROLE_LABELS[p.assignedRole]}
            </span>
            <span className="flex-1 font-semibold text-[0.9rem] overflow-hidden text-ellipsis whitespace-nowrap">
              {p.name}
            </span>
            <div className="flex gap-1 flex-wrap justify-end">
              {showMost &&
                p.most[p.assignedRole].map((hero, i) => (
                  <span key={i} className={`badge-sm-${p.assignedRole}`}>
                    {hero}
                  </span>
                ))}
              {showBan &&
                p.banned.length > 0 &&
                p.banned.map((role) => (
                  <span key={role} className="badge-ban">
                    🚫{ROLE_LABELS[role]}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultView() {
  const { resultA, resultB, settings, reset } = useAppStore(
    useShallow((s) => ({
      resultA: s.resultA,
      resultB: s.resultB,
      settings: s.settings,
      reset: s.reset,
    }))
  );

  const captureRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const download = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current, { backgroundColor: '#0f0f1a', scale: 2 });
    const link = document.createElement('a');
    link.download = 'team-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div ref={viewRef} className="w-full max-w-[900px] px-6 py-8 flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="section-title">배정 완료!</h2>
        <p className="section-desc mt-1">모든 팀원의 역할이 배정되었습니다.</p>
      </div>

      <div className="w-full flex flex-col gap-4 p-4 bg-base rounded-2xl">
        <div ref={captureRef} className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
          <TeamResult
            players={resultA}
            label="A"
            showMost={settings.useMost}
            showBan={settings.useBan}
          />
          <TeamResult
            players={resultB}
            label="B"
            showMost={settings.useMost}
            showBan={settings.useBan}
          />
        </div>
        <MapPicker teamAName="팀 A" teamBName="팀 B" />
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <button className="btn-icon" onClick={download}>
          📷 이미지 저장
        </button>
        <button className="btn-primary" onClick={reset}>
          처음부터 다시 →
        </button>
      </div>
    </div>
  );
}
