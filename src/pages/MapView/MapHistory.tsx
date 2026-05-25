import { useShallow } from 'zustand/react/shallow';
import type { PlayedMap } from '../../types';
import { useAppStore } from '../../store';
import { Card, Text } from '../../ui';
import WinnerBtn from './WinnerBtn';
import { MapModeBadge } from './MapModeBadge';

type Winner = PlayedMap['winner'];

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
    <Card className="px-5 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Text as="span" variant="label">진행한 맵 ({mapHistory.length})</Text>
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
              <MapModeBadge mode={entry.mode} className="text-[0.65rem] px-2 py-0.5 whitespace-nowrap" />
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
    </Card>
  );
}
