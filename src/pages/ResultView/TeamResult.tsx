import type { CSSProperties } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { sortBy } from 'es-toolkit';
import type { AssignedPlayer, Role } from '../../types';
import { useAppStore } from '../../store';
import { Badge, Card } from '../../ui';

const ROLE_LABELS: Record<Role, string> = { tank: '탱커', dps: '딜러', heal: '힐러' };
const ROLE_ORDER: Role[] = ['tank', 'heal', 'dps'];

function sortByRole(players: AssignedPlayer[]) {
  return sortBy(players, [(p) => ROLE_ORDER.indexOf(p.assignedRole)]);
}

export default function TeamResult({
  players,
  label,
  cardDelay = 0.2,
}: {
  players: AssignedPlayer[];
  label: string;
  cardDelay?: number;
}) {
  const { useMost, useBan } = useAppStore(
    useShallow((s) => ({
      useMost: s.settings.useMost,
      useBan: s.settings.useBan,
    }))
  );

  const sorted = sortByRole(players);
  const borderColor: Record<Role, string> = {
    tank: 'var(--color-tank)',
    dps: 'var(--color-dps)',
    heal: 'var(--color-heal)',
  };
  return (
    <Card
      className="overflow-hidden page-card"
      style={{ '--card-delay': `${cardDelay}s` } as CSSProperties}
    >
      <div className="px-4 py-3 font-bold text-[0.95rem] text-lilac bg-[#14142a] border-b border-line">
        팀 {label}
      </div>
      <div className="flex flex-col">
        {sorted.map((p, i) => (
          <div
            key={p.id}
            className="page-row flex items-center gap-2.5 px-4 py-2.5 border-b border-[#1f1f38] last:border-0 hover:bg-white/[0.02] transition-colors"
            style={{
              borderLeft: `3px solid ${borderColor[p.assignedRole]}`,
              '--row-delay': `${cardDelay + 0.14 + i * 0.065}s`,
            } as CSSProperties}
          >
            <Badge role={p.assignedRole} className="min-w-10 text-center">
              {ROLE_LABELS[p.assignedRole]}
            </Badge>
            <span className="flex-1 font-semibold text-[0.9rem] overflow-hidden text-ellipsis whitespace-nowrap">
              {p.name}
            </span>
            <div className="flex gap-1 flex-wrap justify-end">
              {useMost &&
                p.most[p.assignedRole].map((hero, i) => (
                  <Badge key={i} role={p.assignedRole} size="sm">
                    {hero}
                  </Badge>
                ))}
              {useBan &&
                p.banned.length > 0 &&
                p.banned.map((role) => (
                  <Badge key={role} role={role} size="sm" className="opacity-60 line-through">
                    🚫{ROLE_LABELS[role]}
                  </Badge>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
