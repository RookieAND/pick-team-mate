import { useState } from 'react';
import { OW_MAPS, HAS_SIDE, type OWMap } from '../../data/maps';

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const MODE_COLOR: Record<string, string> = {
  점령: '#3b82f6',
  호위: '#f59e0b',
  혼합: '#a855f7',
  밀기: '#22c55e',
  플래시포인트: '#ef4444',
  섬멸: '#ec4899',
};

export default function MapPicker({
  teamAName,
  teamBName,
}: {
  teamAName: string;
  teamBName: string;
}) {
  const [picked, setPicked] = useState<OWMap | null>(null);
  const [side, setSide] = useState<{ first: string; second: string } | null>(null);
  const [spinning, setSpinning] = useState(false);

  const pick = () => {
    setSpinning(true);
    setTimeout(() => {
      const map = randomItem(OW_MAPS);
      setPicked(map);
      if (HAS_SIDE.includes(map.mode)) {
        const coin = Math.random() < 0.5;
        setSide({ first: coin ? teamAName : teamBName, second: coin ? teamBName : teamAName });
      } else {
        setSide(null);
      }
      setSpinning(false);
    }, 500);
  };

  return (
    <div className="card px-5 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.88rem] font-bold text-muted uppercase tracking-wide">맵 뽑기</span>
        <button className="btn-sm" onClick={pick} disabled={spinning}>
          {spinning ? '추첨 중...' : picked ? '다시 뽑기' : '맵 뽑기'}
        </button>
      </div>

      {picked && !spinning && (
        <div className="flex items-center gap-2.5 flex-wrap pop-in">
          <span
            className="text-[0.72rem] font-bold px-2.5 py-0.5 rounded-full text-white whitespace-nowrap"
            style={{ background: MODE_COLOR[picked.mode] ?? '#555' }}
          >
            {picked.mode}
          </span>
          <span className="text-[1.1rem] font-extrabold text-text">{picked.name}</span>
          {side && (
            <div className="flex gap-3 ml-auto flex-wrap">
              <span className="text-[0.8rem] text-muted">
                ⚔ 선공: <strong className="text-warn">{side.first}</strong>
              </span>
              <span className="text-[0.8rem] text-muted">
                🛡 후공: <strong className="text-tank-t">{side.second}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
