import { useState, useRef, useEffect } from 'react';
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

  const [phase, setPhase] = useState<'idle' | 'ready' | 'done'>('idle');
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());
  const [revealingIdx, setRevealingIdx] = useState<number | null>(null);
  const [bulkRevealing, setBulkRevealing] = useState(false);
  const [assigned, setAssigned] = useState<AssignedPlayer[]>([]);

  const rungsRef = useRef<boolean[][]>([]);
  const slotsRef = useRef<Role[]>([]);
  const destinationsRef = useRef<number[]>([]);

  // All individually clicked → auto-advance to done
  useEffect(() => {
    if (
      phase === 'ready' &&
      !bulkRevealing &&
      revealingIdx === null &&
      assigned.length > 0 &&
      revealedSet.size === players.length
    ) {
      setPhase('done');
      onDone(assigned);
    }
  }, [revealedSet, phase, bulkRevealing, revealingIdx, players.length, assigned, onDone]);

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
    slotsRef.current = slots;
    destinationsRef.current = players.map((_, i) => tracePath(i, rungs));
    setAssigned(result);
    setRevealedSet(new Set());
    setRevealingIdx(null);
    setBulkRevealing(false);
    setPhase('ready');
  };

  const handleRevealPlayer = (idx: number) => {
    if (revealedSet.has(idx) || revealingIdx !== null || bulkRevealing) return;
    setRevealingIdx(idx);
    setTimeout(() => {
      setRevealedSet((prev) => new Set([...prev, idx]));
      setRevealingIdx(null);
    }, 700);
  };

  const handleRevealAll = () => {
    if (bulkRevealing || revealingIdx !== null) return;
    const unrevealed = players.map((_, i) => i).filter((i) => !revealedSet.has(i));
    if (unrevealed.length === 0) return;

    setBulkRevealing(true);
    unrevealed.forEach((idx, i) => {
      setTimeout(() => {
        setRevealedSet((prev) => new Set([...prev, idx]));
      }, i * 380 + 80);
    });
    setTimeout(() => {
      setPhase('done');
      onDone(assigned);
    }, unrevealed.length * 380 + 480);
  };

  const ROWS = 8;
  const COL_W = 60;
  const rungs = rungsRef.current;
  const svgW = players.length * COL_W;
  const svgH = ROWS * 30 + 20;

  // Slot j is revealed only after the path animation completes (revealedSet, not revealingIdx)
  const revealedDestinations = new Set(
    [...revealedSet].map((i) => destinationsRef.current[i])
  );

  const buildPath = (startCol: number): string => {
    const parts: string[] = [];
    let col = startCol;
    parts.push(`M ${col * COL_W + 30} 10`);
    for (let row = 0; row < ROWS; row++) {
      const midY = row * 30 + 25;
      parts.push(`L ${col * COL_W + 30} ${midY}`);
      if (col > 0 && rungs[col - 1]?.[row]) {
        col -= 1;
        parts.push(`L ${col * COL_W + 30} ${midY}`);
      } else if (col < rungs.length && rungs[col]?.[row]) {
        col += 1;
        parts.push(`L ${col * COL_W + 30} ${midY}`);
      }
    }
    parts.push(`L ${col * COL_W + 30} ${ROWS * 30 + 10}`);
    return parts.join(' ');
  };

  return (
    <div className="card p-5 flex flex-col items-center gap-3.5">
      <h3 className="text-[1.1rem] font-bold text-lilac">팀 {label}</h3>

      {phase === 'idle' && (
        <button className="btn-sm" onClick={startLadder}>
          사다리 시작
        </button>
      )}

      {phase !== 'idle' && (
        <div className="w-full flex flex-col items-center gap-2">
          {/* Clickable player name buttons */}
          <div className="flex justify-around" style={{ width: svgW }}>
            {players.map((p, i) => {
              const isRevealed = revealedSet.has(i);
              const isAnimating = revealingIdx === i;
              const role = assigned[i]?.assignedRole;
              return (
                <button
                  key={p.id}
                  className={[
                    'ladder-player-btn',
                    isAnimating ? 'animating' : '',
                    isRevealed && role ? `revealed-${role}` : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleRevealPlayer(i)}
                  disabled={isRevealed || isAnimating || bulkRevealing || phase === 'done'}
                >
                  {p.name || `#${i + 1}`}
                </button>
              );
            })}
          </div>

          {/* Ladder SVG */}
          <div className="ladder-svg-wrap" style={{ width: svgW }}>
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
              {players.map((_, startCol) => {
                if (!revealedSet.has(startCol) && revealingIdx !== startCol) return null;
                return (
                  <path
                    key={`path${startCol}`}
                    d={buildPath(startCol)}
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

          {/* Bottom role slots — reveal after path animation finishes */}
          <div className="flex justify-around" style={{ width: svgW }}>
            {slotsRef.current.map((role, j) =>
              revealedDestinations.has(j) ? (
                <RoleBadge key={j} role={role} className="min-w-[48px] text-center pop-in">
                  {ROLE_LABELS[role]}
                </RoleBadge>
              ) : (
                <span key={j} className="ladder-slot-hidden">
                  ?
                </span>
              )
            )}
          </div>

          {/* Reveal-all button */}
          {phase === 'ready' && !bulkRevealing && (
            <button
              className="btn-sm text-[0.8rem]! py-[8px]! px-5! mt-1"
              onClick={handleRevealAll}
              disabled={revealingIdx !== null}
            >
              전체 공개
            </button>
          )}
        </div>
      )}

      {/* Result summary */}
      {phase === 'done' && (
        <div className="w-full flex flex-col gap-1.5 mt-1">
          {assigned.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center bg-white/4 rounded-lg px-3 py-2"
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
