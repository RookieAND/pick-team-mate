import { useState, useRef } from 'react';
import type { Player, Role, AssignedPlayer } from '../../types';
import { useAppStore } from '../../store';
import RoleBadge from '../RoleBadge';

const ROLE_LABELS: Record<Role, string> = { tank: '탱', dps: '딜', heal: '힐' };
const ROLE_SLOTS_5: Role[] = ['tank', 'dps', 'dps', 'heal', 'heal'];
const ROLE_SLOTS_6: Role[] = ['tank', 'tank', 'dps', 'dps', 'heal', 'heal'];

function getRoleSlots(count: number): Role[] {
  return count === 6 ? ROLE_SLOTS_6 : ROLE_SLOTS_5;
}

function generateLadder(count: number): boolean[][] {
  const ROWS = 8;
  const rungs: boolean[][] = Array.from({ length: count - 1 }, () =>
    Array.from({ length: ROWS }, () => false)
  );
  for (let row = 0; row < ROWS; row++) {
    let col = 0;
    while (col < count - 1) {
      if (Math.random() > 0.5) {
        rungs[col][row] = true;
        col += 2;
      } else {
        col += 1;
      }
    }
  }
  return rungs;
}

function tracePath(startCol: number, rungs: boolean[][]): number {
  const ROWS = rungs[0]?.length ?? 8;
  let col = startCol;
  for (let row = 0; row < ROWS; row++) {
    if (col > 0 && rungs[col - 1][row]) col -= 1;
    else if (col < rungs.length && rungs[col][row]) col += 1;
  }
  return col;
}

interface TeamLadderProps {
  players: Player[];
  label: string;
  onDone: (assigned: AssignedPlayer[]) => void;
}

export default function TeamLadder({ players, label, onDone }: TeamLadderProps) {
  const useBan = useAppStore((s) => s.settings.useBan);

  const [phase, setPhase] = useState<'idle' | 'animating' | 'done'>('idle');
  const [revealedPaths, setRevealedPaths] = useState<boolean[]>(() =>
    Array(players.length).fill(false)
  );
  const [assigned, setAssigned] = useState<AssignedPlayer[]>([]);
  const rungsRef = useRef<boolean[][]>([]);

  const startLadder = () => {
    const roleSlots = getRoleSlots(players.length);
    let slots: Role[] = [],
      rungs: boolean[][] = [],
      result: AssignedPlayer[] = [];
    for (let attempt = 0; attempt < 200; attempt++) {
      slots = [...roleSlots].sort(() => Math.random() - 0.5);
      rungs = generateLadder(players.length);
      const mapping = players.map((_, i) => tracePath(i, rungs));
      result = players.map((p, i) => ({ ...p, assignedRole: slots[mapping[i]] }));
      if (!useBan || !result.some((p) => p.banned.includes(p.assignedRole))) break;
    }
    rungsRef.current = rungs;
    setAssigned(result);
    setPhase('animating');
    players.forEach((_, i) => {
      setTimeout(
        () => {
          setRevealedPaths((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
          if (i === players.length - 1)
            setTimeout(() => {
              setPhase('done');
              onDone(result);
            }, 600);
        },
        i * 400 + 300
      );
    });
  };

  const ROWS = 8;
  const COL_W = 60;
  const rungs = rungsRef.current;
  const svgW = players.length * COL_W;
  const svgH = ROWS * 30 + 20;
  const roleSlots = getRoleSlots(players.length);

  return (
    <div className="card p-5 flex flex-col items-center gap-3.5">
      <h3 className="text-[1.1rem] font-bold text-lilac">팀 {label}</h3>

      {phase === 'idle' && (
        <button className="btn-sm" onClick={startLadder}>
          사다리 시작
        </button>
      )}

      {phase !== 'idle' && (
        <div className="w-full flex flex-col items-center gap-1.5">
          <div className="flex justify-around" style={{ width: svgW }}>
            {players.map((p, i) => (
              <div key={p.id} className={`ladder-name ${revealedPaths[i] ? 'revealed' : ''}`}>
                {p.name || `#${i + 1}`}
              </div>
            ))}
          </div>

          <div className="ladder-svg-wrap">
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              xmlns="http://www.w3.org/2000/svg"
              className="ladder-svg"
            >
              {players.map((_, col) => (
                <line
                  key={`v${col}`}
                  x1={col * COL_W + 30}
                  y1={10}
                  x2={col * COL_W + 30}
                  y2={ROWS * 30 + 10}
                  stroke="#333355"
                  strokeWidth="2"
                />
              ))}
              {rungs.map((colRungs, col) =>
                colRungs.map((hasRung, row) =>
                  hasRung ? (
                    <line
                      key={`h${col}_${row}`}
                      x1={col * COL_W + 30}
                      y1={row * 30 + 25}
                      x2={(col + 1) * COL_W + 30}
                      y2={row * 30 + 25}
                      stroke="#5533aa"
                      strokeWidth="2"
                    />
                  ) : null
                )
              )}
              {revealedPaths.map((revealed, startCol) => {
                if (!revealed || !rungs.length) return null;
                const pathParts: string[] = [];
                let col = startCol;
                pathParts.push(`M ${col * COL_W + 30} 10`);
                for (let row = 0; row < ROWS; row++) {
                  const midY = row * 30 + 25;
                  pathParts.push(`L ${col * COL_W + 30} ${midY}`);
                  if (col > 0 && rungs[col - 1]?.[row]) {
                    col -= 1;
                    pathParts.push(`L ${col * COL_W + 30} ${midY}`);
                  } else if (col < rungs.length && rungs[col]?.[row]) {
                    col += 1;
                    pathParts.push(`L ${col * COL_W + 30} ${midY}`);
                  }
                }
                pathParts.push(`L ${col * COL_W + 30} ${ROWS * 30 + 10}`);
                return (
                  <path
                    key={`path${startCol}`}
                    d={pathParts.join(' ')}
                    stroke={`hsl(${(startCol * 60) % 360}, 80%, 65%)`}
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="path-reveal"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex justify-around" style={{ width: svgW }}>
            {roleSlots.map((role, i) => (
              <RoleBadge key={i} role={role} className="min-w-[48px] text-center">
                {ROLE_LABELS[role]}
              </RoleBadge>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="w-full flex flex-col gap-1.5">
          {assigned.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center bg-white/[0.04] rounded-lg px-3 py-2"
            >
              <span className="font-semibold text-[0.9rem]">{p.name}</span>
              <RoleBadge role={p.assignedRole}>{ROLE_LABELS[p.assignedRole]}</RoleBadge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
