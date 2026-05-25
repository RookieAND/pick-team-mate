import { useShallow } from 'zustand/react/shallow';
import type { Player, Role, HeroMost } from '../../types';
import { HEROES } from '../../data/heroes';
import { useAppStore } from '../../store';
import { Badge, Input } from '../../ui';
import SearchableSelect from '../../components/SearchableSelect';

const ROLE_LABELS: Record<Role, string> = { tank: '탱커', dps: '딜러', heal: '힐러' };
const ROLES: Role[] = ['tank', 'dps', 'heal'];

export default function PlayerCard({
  player,
  index,
  onChange,
  isActive,
  onSelect,
  onTabNext,
  onTabPrev,
}: {
  player: Player;
  index: number;
  onChange: (p: Player) => void;
  isActive: boolean;
  onSelect: () => void;
  onTabNext: () => void;
  onTabPrev: () => void;
}) {
  const { useMost, useBan } = useAppStore(
    useShallow((s) => ({
      useMost: s.settings.useMost,
      useBan: s.settings.useBan,
    }))
  );

  const setHero = (role: Role, rank: 0 | 1 | 2, hero: string) => {
    const newMost: HeroMost = {
      ...player.most,
      [role]: player.most[role].map((h, i) => (i === rank ? hero : h)) as [string, string, string],
    };
    onChange({ ...player, most: newMost });
  };

  const toggleBan = (role: Role) => {
    const alreadyBanned = player.banned.includes(role);
    const banned = alreadyBanned ? [] : [role];
    onChange({ ...player, banned });
  };

  const filled = player.name.trim().length > 0;

  return (
    <div
      className={`bg-surface border border-line rounded-[14px] overflow-hidden transition-colors ${isActive ? 'border-purple!' : ''} ${filled && !isActive ? 'border-line-strong!' : ''}`}
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-transparent hover:bg-white/[0.03] transition-colors text-left"
        onClick={onSelect}
      >
        <span className="text-[0.72rem] text-faint font-bold min-w-7">#{index + 1}</span>

        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-[0.62rem] text-faint font-bold shrink-0">[닉네임]</span>
          <span
            className={`text-[0.88rem] font-semibold truncate ${filled ? 'text-lilac' : 'text-faint'}`}
          >
            {player.name || '미입력'}
          </span>
        </div>

        {useMost && filled && (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div className="flex gap-1">
              <Badge role="tank" size="sm">{player.most.tank[0]}</Badge>
              <Badge role="dps"  size="sm">{player.most.dps[0]}</Badge>
              <Badge role="heal" size="sm">{player.most.heal[0]}</Badge>
            </div>
          </div>
        )}

        {useBan && player.banned.length > 0 && (
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            {player.banned.map((role) => (
              <Badge key={role} role={role} size="sm" className="opacity-60 line-through">
                {ROLE_LABELS[role]}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          {filled && <span className="text-[0.75rem] text-purple font-bold">✓</span>}
          <span className="text-[0.65rem] text-faint">{isActive ? '▲' : '▼'}</span>
        </div>
      </button>

      {isActive && (
        <div className="flex flex-col gap-3 px-4 pb-4 border-t border-line">
          <div className="flex flex-col gap-1.5 pt-3">
            <label className="text-[0.73rem] text-muted font-bold uppercase tracking-wide">
              닉네임
            </label>
            <Input
              type="text"
              value={player.name}
              placeholder="닉네임 입력"
              autoFocus
              onChange={(e) => onChange({ ...player, name: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  e.shiftKey ? onTabPrev() : onTabNext();
                }
              }}
            />
          </div>

          {useMost && (
            <div className="flex flex-col gap-2.5 pt-1">
              {ROLES.map((role) => (
                <div key={role} className="flex items-center gap-2.5">
                  <Badge role={role} className="min-w-9 text-center">
                    {ROLE_LABELS[role]}
                  </Badge>
                  <div className="flex-1 flex gap-1.5">
                    {([0, 1, 2] as const).map((rank) => (
                      <div key={rank} className="flex-1 flex items-center gap-1">
                        <span className="text-[0.65rem] text-faint font-bold">{rank + 1}</span>
                        <SearchableSelect
                          value={player.most[role][rank]}
                          options={HEROES[role]}
                          roleClass={`role-${role}`}
                          onChange={(v) => setHero(role, rank, v)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {useBan && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.73rem] text-muted font-bold uppercase tracking-wide flex items-center gap-1.5">
                역할 밴{' '}
                <span className="text-[0.68rem] text-faint font-normal normal-case tracking-normal">
                  너무 잘해서 제외
                </span>
              </label>
              <div className="flex gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    className={[
                      'flex-1 py-2.5 rounded-lg text-[0.78rem] font-bold border-[1.5px] border-line bg-base text-faint cursor-pointer transition-all font-[inherit]',
                      role === 'tank' && player.banned.includes(role) ? 'bg-tank-b border-tank text-tank-t opacity-60 line-through' : '',
                      role === 'dps'  && player.banned.includes(role) ? 'bg-dps-b border-dps text-dps-t opacity-60 line-through' : '',
                      role === 'heal' && player.banned.includes(role) ? 'bg-heal-b border-heal text-heal-t opacity-60 line-through' : '',
                      role === 'tank' && !player.banned.includes(role) ? 'hover:text-tank-t hover:border-tank' : '',
                      role === 'dps'  && !player.banned.includes(role) ? 'hover:text-dps-t hover:border-dps' : '',
                      role === 'heal' && !player.banned.includes(role) ? 'hover:text-heal-t hover:border-heal' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => toggleBan(role)}
                  >
                    {player.banned.includes(role) ? '🚫 ' : ''}
                    {ROLE_LABELS[role]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
