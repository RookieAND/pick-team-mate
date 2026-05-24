import { useShallow } from 'zustand/react/shallow';
import type { PlayedMap } from '../../types';
import { useAppStore } from '../../store';

const MODE_COLOR: Record<string, string> = {
  점령: '#3b82f6', 호위: '#f59e0b', 혼합: '#a855f7',
  밀기: '#22c55e', 플래시포인트: '#ef4444', 섬멸: '#ec4899',
};

type Winner = PlayedMap['winner'];

function WinnerBtn({
  label,
  value,
  current,
  onClick,
}: {
  label: string;
  value: Winner;
  current: Winner;
  onClick: () => void;
}) {
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

export default function MapHistory() {
  const { mapHistory, updateMapWinner, clearMapHistory } = useAppStore(
    useShallow((s) => ({
      mapHistory: s.mapHistory,
      updateMapWinner: s.updateMapWinner,
      clearMapHistory: s.clearMapHistory,
    }))
  );

  if (mapHistory.length === 0) return null;

  const toggleWinner = (id: string, value: Winner, current: Winner) => {
    updateMapWinner(id, current === value ? null : value);
  };

  return (
    <div className="card px-5 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[0.88rem] font-bold text-muted uppercase tracking-wide">
          진행한 맵 ({mapHistory.length})
        </span>
        <button
          className="text-[0.75rem] text-faint hover:text-danger transition-colors"
          onClick={clearMapHistory}
        >
          전체 삭제
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {mapHistory.map((entry, idx) => (
          <div key={entry.id} className="flex flex-col gap-1.5 bg-base rounded-xl px-3.5 py-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[0.65rem] font-bold text-muted">{idx + 1}</span>
              <span
                className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap"
                style={{ background: MODE_COLOR[entry.mode] ?? '#555' }}
              >
                {entry.mode}
              </span>
              <span className="font-semibold text-[0.92rem] text-text flex-1 min-w-0 truncate">
                {entry.name}
              </span>
              <div className="flex gap-1.5 shrink-0">
                <WinnerBtn label="A 승" value="A" current={entry.winner} onClick={() => toggleWinner(entry.id, 'A', entry.winner)} />
                <WinnerBtn label="무" value="draw" current={entry.winner} onClick={() => toggleWinner(entry.id, 'draw', entry.winner)} />
                <WinnerBtn label="B 승" value="B" current={entry.winner} onClick={() => toggleWinner(entry.id, 'B', entry.winner)} />
              </div>
            </div>
            {entry.side && (
              <div className="flex gap-3 pl-5">
                <span className="text-[0.75rem] text-muted">
                  ⚔ 선공 <strong className="text-warn">{entry.side.first}</strong>
                </span>
                <span className="text-[0.75rem] text-muted">
                  🛡 후공 <strong className="text-tank-t">{entry.side.second}</strong>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
