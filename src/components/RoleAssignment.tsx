import { useState, useEffect, useRef } from 'react';
import type { Player, Role, AssignedPlayer } from '../types';
import './RoleAssignment.css';

interface Props {
  teamA: Player[];
  teamB: Player[];
  onResult: (teamA: AssignedPlayer[], teamB: AssignedPlayer[]) => void;
  onBack: () => void;
}

const ROLE_LABELS: Record<Role, string> = { tank: '탱', dps: '딜', heal: '힐' };
const ROLE_SLOTS: Role[] = ['tank', 'dps', 'dps', 'heal', 'heal'];

function assignRoles(players: Player[]): AssignedPlayer[] {
  const slots = [...ROLE_SLOTS];
  const shuffledSlots = slots.sort(() => Math.random() - 0.5);
  return players.map((p, i) => ({ ...p, assignedRole: shuffledSlots[i] }));
}

interface LadderLine {
  from: number;
  to: number;
  hasRung: boolean[];
}

function generateLadder(count: number): boolean[][] {
  // rungs[col][row] = true means there's a horizontal bar between col and col+1 at row
  const ROWS = 8;
  const rungs: boolean[][] = Array.from({ length: count - 1 }, () =>
    Array.from({ length: ROWS }, () => false)
  );

  for (let row = 0; row < ROWS; row++) {
    let col = 0;
    while (col < count - 1) {
      if (Math.random() > 0.5) {
        rungs[col][row] = true;
        col += 2; // skip adjacent
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

function TeamLadder({ players, label, onDone }: TeamLadderProps) {
  const [phase, setPhase] = useState<'idle' | 'animating' | 'done'>('idle');
  const [revealedPaths, setRevealedPaths] = useState<boolean[]>(Array(5).fill(false));
  const [assigned, setAssigned] = useState<AssignedPlayer[]>([]);
  const rungsRef = useRef<boolean[][]>([]);
  const mappingRef = useRef<number[]>([]);

  const startLadder = () => {
    // Retry until no player gets a banned role (max 200 attempts)
    let slots: Role[] = [];
    let rungs: boolean[][] = [];
    let mapping: number[] = [];
    let result: AssignedPlayer[] = [];

    for (let attempt = 0; attempt < 200; attempt++) {
      slots = [...ROLE_SLOTS].sort(() => Math.random() - 0.5);
      rungs = generateLadder(5);
      mapping = players.map((_, i) => tracePath(i, rungs));
      result = players.map((p, i) => ({ ...p, assignedRole: slots[mapping[i]] }));
      const hasBanConflict = result.some(p => p.banned.includes(p.assignedRole));
      if (!hasBanConflict) break;
    }

    rungsRef.current = rungs;
    mappingRef.current = mapping;
    setAssigned(result);
    setPhase('animating');

    players.forEach((_, i) => {
      setTimeout(() => {
        setRevealedPaths(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        if (i === players.length - 1) {
          setTimeout(() => {
            setPhase('done');
            onDone(result);
          }, 600);
        }
      }, i * 400 + 300);
    });
  };

  const ROWS = 8;
  const rungs = rungsRef.current;

  return (
    <div className="team-ladder">
      <h3 className="team-label">팀 {label}</h3>

      {phase === 'idle' && (
        <button className="start-btn" onClick={startLadder}>
          사다리 시작
        </button>
      )}

      {phase !== 'idle' && (
        <div className="ladder-visual">
          {/* Player names (top) */}
          <div className="ladder-names top">
            {players.map((p, i) => (
              <div key={p.id} className={`ladder-name ${revealedPaths[i] ? 'revealed' : ''}`}>
                {p.name || `#${i+1}`}
              </div>
            ))}
          </div>

          {/* SVG ladder */}
          <div className="ladder-svg-wrap">
            <svg
              viewBox={`0 0 ${5 * 60} ${ROWS * 30 + 20}`}
              xmlns="http://www.w3.org/2000/svg"
              className="ladder-svg"
            >
              {/* Vertical lines */}
              {players.map((_, col) => (
                <line
                  key={`v${col}`}
                  x1={col * 60 + 30}
                  y1={10}
                  x2={col * 60 + 30}
                  y2={ROWS * 30 + 10}
                  stroke="#333355"
                  strokeWidth="2"
                />
              ))}

              {/* Horizontal rungs */}
              {rungs.map((colRungs, col) =>
                colRungs.map((hasRung, row) =>
                  hasRung ? (
                    <line
                      key={`h${col}_${row}`}
                      x1={col * 60 + 30}
                      y1={row * 30 + 25}
                      x2={(col + 1) * 60 + 30}
                      y2={row * 30 + 25}
                      stroke="#5533aa"
                      strokeWidth="2"
                    />
                  ) : null
                )
              )}

              {/* Animated path highlights */}
              {revealedPaths.map((revealed, startCol) => {
                if (!revealed || !rungs.length) return null;
                // Draw path for this player
                const pathParts: string[] = [];
                let col = startCol;
                let y = 10;
                pathParts.push(`M ${col * 60 + 30} ${y}`);
                for (let row = 0; row < ROWS; row++) {
                  const midY = row * 30 + 25;
                  // go down to rung level
                  pathParts.push(`L ${col * 60 + 30} ${midY}`);
                  if (col > 0 && rungs[col - 1]?.[row]) {
                    col -= 1;
                    pathParts.push(`L ${col * 60 + 30} ${midY}`);
                  } else if (col < rungs.length && rungs[col]?.[row]) {
                    col += 1;
                    pathParts.push(`L ${col * 60 + 30} ${midY}`);
                  }
                }
                pathParts.push(`L ${col * 60 + 30} ${ROWS * 30 + 10}`);

                const hue = (startCol * 60) % 360;
                return (
                  <path
                    key={`path${startCol}`}
                    d={pathParts.join(' ')}
                    stroke={`hsl(${hue}, 80%, 65%)`}
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

          {/* Role slots (bottom) */}
          <div className="ladder-names bottom">
            {ROLE_SLOTS.map((role, i) => (
              <div key={i} className={`ladder-role role-${role}`}>
                {ROLE_LABELS[role]}
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="assigned-list">
          {assigned.map(p => (
            <div key={p.id} className="assigned-row">
              <span className="assigned-name">{p.name}</span>
              <span className={`assigned-role role-badge role-${p.assignedRole}`}>
                {ROLE_LABELS[p.assignedRole]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RoleAssignment({ teamA, teamB, onResult, onBack }: Props) {
  const [doneA, setDoneA] = useState<AssignedPlayer[] | null>(null);
  const [doneB, setDoneB] = useState<AssignedPlayer[] | null>(null);

  useEffect(() => {
    if (doneA && doneB) onResult(doneA, doneB);
  }, [doneA, doneB, onResult]);

  return (
    <div className="role-assignment">
      <h2 className="section-title">사다리타기 역할 배정</h2>
      <p className="section-desc">각 팀의 사다리 시작 버튼을 눌러 역할을 배정하세요.</p>
      <div className="ladders-wrap">
        <TeamLadder players={teamA} label="A" onDone={setDoneA} />
        <TeamLadder players={teamB} label="B" onDone={setDoneB} />
      </div>
      <button className="secondary-btn" onClick={onBack}>← 팀 다시 나누기</button>
    </div>
  );
}
