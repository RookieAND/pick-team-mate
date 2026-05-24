import { useState } from 'react';
import { OW_MAPS, HAS_SIDE, type OWMap } from '../data/maps';
import './MapPicker.css';

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const MODE_COLOR: Record<string, string> = {
  '점령': '#3b82f6',
  '호위': '#f59e0b',
  '혼합': '#a855f7',
  '밀어붙이기': '#22c55e',
  '플래시포인트': '#ef4444',
  '섬멸': '#ec4899',
};

export default function MapPicker({ teamAName, teamBName }: { teamAName: string; teamBName: string }) {
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
    <div className="map-picker">
      <div className="map-picker-header">
        <span className="map-picker-title">맵 뽑기</span>
        <button className="map-pick-btn" onClick={pick} disabled={spinning}>
          {spinning ? '추첨 중...' : picked ? '다시 뽑기' : '맵 뽑기'}
        </button>
      </div>

      {picked && !spinning && (
        <div className="map-result">
          <span className="map-mode-badge" style={{ background: MODE_COLOR[picked.mode] ?? '#555' }}>
            {picked.mode}
          </span>
          <span className="map-name">{picked.name}</span>
          {side && (
            <div className="map-sides">
              <span className="side-item first">⚔ 선공: <strong>{side.first}</strong></span>
              <span className="side-item second">🛡 후공: <strong>{side.second}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
