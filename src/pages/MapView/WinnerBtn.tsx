import type { PlayedMap } from '../../types';

type Winner = PlayedMap['winner'];

interface WinnerBtnProps {
  label: string;
  value: Winner;
  current: Winner;
  onClick: () => void;
}

export default function WinnerBtn({ label, value, current, onClick }: WinnerBtnProps) {
  const active = current === value;
  return (
    <button
      onClick={onClick}
      className={`text-[0.72rem] font-bold px-2.5 py-1 rounded-lg border transition-all ${
        active
          ? value === 'A'
            ? 'bg-tank-b border-tank text-tank-t'
            : value === 'B'
              ? 'bg-dps-b border-dps text-dps-t'
              : 'bg-surface border-line-strong text-lavender'
          : 'bg-transparent border-line text-faint hover:border-line-strong hover:text-sub'
      }`}
    >
      {label}
    </button>
  );
}
