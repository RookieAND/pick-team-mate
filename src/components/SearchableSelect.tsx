import { useState, useRef, useEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sorted = [...options].sort((a, b) => a.localeCompare(b, 'ko'));
  const filtered = query
    ? sorted.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : sorted;

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery('');
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`ss-wrap ${open ? 'open' : ''}`}>
      <button
        type="button"
        className={`ss-trigger ${roleClass}`}
        onClick={() => setOpen(o => !o)}
      >
        <span className="ss-value">{value}</span>
        <span className="ss-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="ss-dropdown">
          <input
            ref={inputRef}
            className="ss-search"
            placeholder="영웅 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <ul className="ss-list">
            {filtered.length > 0
              ? filtered.map(opt => (
                  <li
                    key={opt}
                    className={`ss-option ${opt === value ? 'selected' : ''}`}
                    onMouseDown={() => select(opt)}
                  >
                    {opt}
                  </li>
                ))
              : <li className="ss-empty">검색 결과 없음</li>
            }
          </ul>
        </div>
      )}
    </div>
  );
}
