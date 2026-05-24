import { useState, useRef, useEffect } from 'react';
import { shuffle, range } from 'es-toolkit';
import type { Player, Role, AssignedPlayer } from '../../types';

const ROLE_SLOTS_5: Role[] = ['tank', 'dps', 'dps', 'heal', 'heal'];
const ROLE_SLOTS_6: Role[] = ['tank', 'tank', 'dps', 'dps', 'heal', 'heal'];

function getRoleSlots(count: number): Role[] {
  return count === 6 ? ROLE_SLOTS_6 : ROLE_SLOTS_5;
}

function generateLadder(count: number): boolean[][] {
  const ROWS = 8;
  const rungs: boolean[][] = range(count - 1).map(() => new Array(ROWS).fill(false));
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

export type LadderPhase = 'idle' | 'ready' | 'done';

export const LADDER_ROWS = 8;
export const LADDER_COL_W = 60;

interface UseLadderGameOptions {
  players: Player[];
  useBan: boolean;
  onDone: (assigned: AssignedPlayer[]) => void;
}

export function useLadderGame({ players, useBan, onDone }: UseLadderGameOptions) {
  const [phase, setPhase] = useState<LadderPhase>('idle');
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
      slots = shuffle([...roleSlots]);
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

  const revealPlayer = (idx: number) => {
    if (revealedSet.has(idx) || revealingIdx !== null || bulkRevealing) return;
    setRevealingIdx(idx);
    setTimeout(() => {
      setRevealedSet((prev) => new Set([...prev, idx]));
      setRevealingIdx(null);
    }, 700);
  };

  const revealAll = () => {
    if (bulkRevealing || revealingIdx !== null) return;
    const unrevealed = range(players.length).filter((i) => !revealedSet.has(i));
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

  const buildPath = (startCol: number): string => {
    const rungs = rungsRef.current;
    const parts: string[] = [];
    let col = startCol;
    parts.push(`M ${col * LADDER_COL_W + 30} 10`);
    for (let row = 0; row < LADDER_ROWS; row++) {
      const midY = row * 30 + 25;
      parts.push(`L ${col * LADDER_COL_W + 30} ${midY}`);
      if (col > 0 && rungs[col - 1]?.[row]) {
        col -= 1;
        parts.push(`L ${col * LADDER_COL_W + 30} ${midY}`);
      } else if (col < rungs.length && rungs[col]?.[row]) {
        col += 1;
        parts.push(`L ${col * LADDER_COL_W + 30} ${midY}`);
      }
    }
    parts.push(`L ${col * LADDER_COL_W + 30} ${LADDER_ROWS * 30 + 10}`);
    return parts.join(' ');
  };

  // Slot j is revealed only after path animation completes (revealedSet, not revealingIdx)
  const revealedDestinations = new Set(
    [...revealedSet].map((i) => destinationsRef.current[i])
  );

  const svgW = players.length * LADDER_COL_W;
  const svgH = LADDER_ROWS * 30 + 20;

  return {
    phase,
    assigned,
    revealedSet,
    revealingIdx,
    bulkRevealing,
    revealedDestinations,
    slots: slotsRef.current,
    rungs: rungsRef.current,
    svgW,
    svgH,
    startLadder,
    revealPlayer,
    revealAll,
    buildPath,
  };
}
