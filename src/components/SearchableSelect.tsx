import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import './SearchableSelect.css';

interface Props {
  value: string;
  options: string[];
  roleClass?: string;
  onChange: (v: string) => void;
}

export default function SearchableSelect({ value, options, roleClass = '', onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const sorted = [...options].sort((a, b) => a.localeCompare(b, 'ko'));
  const filtered = query
    ? sorted.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : sorted;

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery('');
  };

  return (
    <Popover.Root open={open} onOpenChange={v => { setOpen(v); if (!v) setQuery(''); }}>
      <Popover.Trigger asChild>
        <button type="button" className={`ss-trigger ${roleClass} ${open ? 'open' : ''}`}>
          <span className="ss-value">{value}</span>
          <span className="ss-arrow">{open ? '▲' : '▼'}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={`ss-content ${roleClass}`}
          side="bottom"
          align="start"
          sideOffset={4}
          avoidCollisions
          collisionPadding={8}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <input
            className="ss-search"
            placeholder="영웅 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <ul className="ss-list">
            {filtered.length > 0
              ? filtered.map(opt => (
                  <li
                    key={opt}
                    className={`ss-option ${opt === value ? 'selected' : ''}`}
                    onMouseDown={e => { e.preventDefault(); select(opt); }}
                  >
                    {opt}
                  </li>
                ))
              : <li className="ss-empty">검색 결과 없음</li>
            }
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
