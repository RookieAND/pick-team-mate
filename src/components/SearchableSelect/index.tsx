import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import './SearchableSelect.css';

interface Props {
  value: string;
  options: string[];
  roleClass?: string;
  onChange: (v: string) => void;
}

const ROLE_OPEN_BORDER: Record<string, string> = {
  'role-tank': 'open:border-tank',
  'role-dps':  'open:border-dps',
  'role-heal': 'open:border-heal',
};

const ROLE_CONTENT_BORDER: Record<string, string> = {
  'role-tank': 'border-tank',
  'role-dps':  'border-dps',
  'role-heal': 'border-heal',
};

export default function SearchableSelect({ value, options, roleClass = '', onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const sorted = [...options].sort((a, b) => a.localeCompare(b, 'ko'));
  const filtered = query
    ? sorted.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : sorted;

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery('');
  };

  const openBorderCls = open ? (ROLE_OPEN_BORDER[roleClass] ? ROLE_OPEN_BORDER[roleClass].replace('open:', '') : '') : '';
  const contentBorderCls = ROLE_CONTENT_BORDER[roleClass] ?? 'border-purple';

  return (
    <Popover.Root
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setQuery('');
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          className={[
            'w-full flex items-center justify-between gap-1 bg-base border border-line rounded-[6px] px-2 py-2 text-text text-[0.78rem] font-[inherit] cursor-pointer transition-[border-color] text-left min-w-0',
            'hover:border-[#555] focus-visible:outline-2 focus-visible:outline-lavender focus-visible:outline-offset-2',
            open ? openBorderCls : '',
          ].filter(Boolean).join(' ')}
        >
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{value}</span>
          <span className="text-[0.55rem] text-faint shrink-0">{open ? '▲' : '▼'}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={[
            'bg-card border rounded-lg z-[200] flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden',
            '[width:max(var(--radix-popper-anchor-width),140px)]',
            '[animation:content-in_0.1s_ease]',
            contentBorderCls,
          ].join(' ')}
          side="bottom"
          align="start"
          sideOffset={4}
          avoidCollisions
          collisionPadding={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <input
            className="bg-base border-none border-b border-line px-2.5 py-[7px] text-text text-[0.78rem] font-[inherit] outline-none w-full placeholder:text-faint"
            style={{ borderBottom: '1px solid var(--color-line)' }}
            placeholder="영웅 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <ul className="ss-list list-none max-h-[200px] overflow-y-auto py-1">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <li
                  key={opt}
                  className={[
                    'px-2.5 py-2.5 text-[0.78rem] text-sub cursor-pointer transition-[background] select-none',
                    'hover:bg-[rgba(124,58,237,0.15)] hover:text-text',
                    opt === value ? 'text-lavender font-semibold' : '',
                  ].filter(Boolean).join(' ')}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(opt);
                  }}
                >
                  {opt}
                </li>
              ))
            ) : (
              <li className="px-2.5 py-2 text-[0.75rem] text-faint text-center">검색 결과 없음</li>
            )}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
