import { useRef, useEffect } from 'react';
import type { Player, AssignedPlayer } from '../../types';
import { useAppStore } from '../../store';
import { Badge, Button, Card } from '../../ui';
import { useLadderGame, LADDER_ROWS, LADDER_COL_W } from './useLadderGame';
import type { Role } from '../../types';

const ROLE_LABELS: Record<Role, string> = { tank: '탱', dps: '딜', heal: '힐' };

interface TeamLadderProps {
  players: Player[];
  label: string;
  onDone: (assigned: AssignedPlayer[]) => void;
  onReset?: () => void;
}

export default function TeamLadder({ players, label, onDone, onReset }: TeamLadderProps) {
  const useBan = useAppStore((s) => s.settings.useBan);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    phase,
    assigned,
    revealedSet,
    revealingIdx,
    bulkRevealing,
    revealedDestinations,
    slots,
    destinations,
    rungs,
    svgW,
    svgH,
    startLadder,
    revealPlayer,
    revealAll,
    buildPath,
  } = useLadderGame({ players, useBan, onDone });

  useEffect(() => {
    if (phase === 'ready') {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [phase]);

  return (
    <div ref={cardRef}>
    <Card className="p-5 flex flex-col items-center gap-3.5">
      <h3 className="text-[1.1rem] font-bold text-lilac">팀 {label}</h3>

      {phase === 'idle' && (
        <Button size="sm" onClick={startLadder}>
          사다리 시작
        </Button>
      )}

      {phase !== 'idle' && (
        <div className="w-full flex flex-col items-center gap-2 ladder-scroll">
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
                  onClick={() => revealPlayer(i)}
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
                  x1={col * LADDER_COL_W + 30}
                  y1={10}
                  x2={col * LADDER_COL_W + 30}
                  y2={LADDER_ROWS * 30 + 10}
                  stroke="#333355"
                  strokeWidth="2"
                />
              ))}
              {rungs.map((colRungs, col) =>
                colRungs.map((hasRung, row) =>
                  hasRung ? (
                    <line
                      key={`h${col}_${row}`}
                      x1={col * LADDER_COL_W + 30}
                      y1={row * 30 + 25}
                      x2={(col + 1) * LADDER_COL_W + 30}
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

          {/* Bottom role slots — always visible; claimed slots show player name */}
          <div className="flex justify-around" style={{ width: svgW }}>
            {slots.map((role, j) => {
              const isRevealed = revealedDestinations.has(j);
              const claimedIdx = isRevealed
                ? destinations.findIndex((dest, i) => dest === j && revealedSet.has(i))
                : -1;
              return (
                <div key={j} className="flex flex-col items-center gap-0.5">
                  <Badge
                    role={role}
                    className={`min-w-[48px] text-center ${isRevealed ? 'pop-in' : 'opacity-30'}`}
                  >
                    {ROLE_LABELS[role]}
                  </Badge>
                  {isRevealed && claimedIdx >= 0 && (
                    <span className="text-[0.68rem] text-white/50 font-medium leading-none">
                      {players[claimedIdx].name || `#${claimedIdx + 1}`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reveal-all button */}
          {phase === 'ready' && !bulkRevealing && (
            <Button
              variant="ghost"
              size="xs"
              className="mt-1"
              onClick={revealAll}
              disabled={revealingIdx !== null}
            >
              전체 공개
            </Button>
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
              <Badge role={p.assignedRole}>{ROLE_LABELS[p.assignedRole]}</Badge>
            </div>
          ))}
          <Button
            variant="ghost"
            className="py-[9px] w-full mt-0.5 text-[0.82rem]"
            onClick={() => { onReset?.(); startLadder(); }}
          >
            다시 뽑기
          </Button>
        </div>
      )}
    </Card>
    </div>
  );
}
