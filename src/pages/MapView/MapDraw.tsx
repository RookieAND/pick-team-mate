import { useState, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { sample, groupBy } from 'es-toolkit';
import confetti from 'canvas-confetti';
import { OW_MAPS, HAS_SIDE } from '../../constants/maps';
import type { OWMap } from '../../types';
import { useAppStore } from '../../store';
import { Button, Card, Dialog, Text } from '../../ui';
import { MapModeBadge } from './MapModeBadge';

const ALL_MODES = ['점령', '호위', '혼합', '밀기', '플래시포인트', '섬멸'] as const;

type CurrentDraw = { map: OWMap; side: { first: string; second: string } | null };

function computeSide(map: OWMap): { first: string; second: string } | null {
  if (!HAS_SIDE.includes(map.mode)) return null;
  const coin = Math.random() < 0.5;
  return { first: coin ? '팀 A' : '팀 B', second: coin ? '팀 B' : '팀 A' };
}

export default function MapDraw() {
  const { mapHistory, mapSettings, addPlayedMap } = useAppStore(
    useShallow((s) => ({
      mapHistory: s.mapHistory,
      mapSettings: s.mapSettings,
      addPlayedMap: s.addPlayedMap,
    }))
  );

  const [current, setCurrent] = useState<CurrentDraw | null>(null);
  const [displayMap, setDisplayMap] = useState<OWMap | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [tickKey, setTickKey] = useState(0);
  const [showManual, setShowManual] = useState(false);

  const finalRef = useRef<OWMap | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const available = OW_MAPS.filter((m) => {
    if (mapSettings.excludedModes.includes(m.mode)) return false;
    if (mapSettings.preventDuplicates && mapHistory.some((h) => h.name === m.name)) return false;
    return true;
  });

  const fireConfetti = () => {
    const colors = ['#a855f7', '#7c3aed', '#c084fc', '#ddd6fe', '#ffffff'];
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.55 }, colors, startVelocity: 28, scalar: 0.9 });
    setTimeout(() => confetti({ particleCount: 40, spread: 50, origin: { y: 0.5, x: 0.35 }, colors, startVelocity: 22, scalar: 0.85 }), 120);
    setTimeout(() => confetti({ particleCount: 40, spread: 50, origin: { y: 0.5, x: 0.65 }, colors, startVelocity: 22, scalar: 0.85 }), 220);
  };

  const settle = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const map = finalRef.current!;
    finalRef.current = null;
    setDisplayMap(null);
    const side = mapSettings.sideMode === 'random' ? computeSide(map) : null;
    setCurrent({ map, side });
    setSpinning(false);
    fireConfetti();
  };

  const draw = () => {
    if (spinning) { settle(); return; }
    if (available.length === 0) return;
    const target = sample(available);
    finalRef.current = target;
    setCurrent(null);
    setSpinning(true);

    const start = Date.now();
    const DURATION = 1400;
    (function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / DURATION, 1);
      if (progress < 1) {
        setDisplayMap(sample(available));
        setTickKey((k) => k + 1);
        timerRef.current = setTimeout(tick, 55 + Math.floor(progress * progress * 310));
      } else {
        settle();
      }
    })();
  };

  const pickManual = (map: OWMap) => {
    const side = mapSettings.sideMode === 'random' ? computeSide(map) : null;
    setCurrent({ map, side });
    setShowManual(false);
  };

  const confirm = () => {
    if (!current) return;
    addPlayedMap({ name: current.map.name, mode: current.map.mode, winner: null, side: current.side });
    setCurrent(null);
  };

  const needsSideChoice =
    current !== null &&
    !spinning &&
    mapSettings.sideMode === 'manual' &&
    HAS_SIDE.includes(current.map.mode) &&
    current.side === null;

  const mapsByMode = groupBy(available, (m) => m.mode);

  return (
    <div className="flex flex-col gap-4">
      <Card className="px-5 py-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Text as="span" variant="label">맵 추첨</Text>
          <div className="flex gap-2">
            {!spinning && (
              <Button variant="ghost" size="xs" onClick={() => setShowManual(true)}>
                직접 선택
              </Button>
            )}
            <Button
              size="sm"
              onClick={draw}
              disabled={!spinning && available.length === 0}
            >
              {spinning ? '즉시 확정' : current ? '다시 뽑기' : '맵 뽑기'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[220px] rounded-xl bg-base border border-line-subtle px-8 py-8">
          {!spinning && !current && available.length === 0 && (
            <p className="text-[0.9rem] text-danger text-center">
              선택 가능한 맵이 없습니다.<br />
              <span className="text-faint text-[0.8rem]">설정에서 모드를 활성화하세요.</span>
            </p>
          )}
          {!spinning && !current && available.length > 0 && (
            <p className="text-[0.9rem] text-faint">맵 뽑기 버튼을 눌러 추첨을 시작하세요</p>
          )}

          {spinning && displayMap && (
            <div key={tickKey} className="flex flex-col items-center gap-3 slot-in">
              <MapModeBadge mode={displayMap.mode} className="text-[0.82rem] px-3 py-1" />
              <span className="text-[2.8rem] font-black text-text tracking-tight leading-none text-center">
                {displayMap.name}
              </span>
            </div>
          )}

          {current && !spinning && (
            <div className="flex flex-col items-center gap-3 pop-in w-full">
              <MapModeBadge mode={current.map.mode} className="text-[0.82rem] px-3 py-1" />
              <span className="text-[2.8rem] font-black text-text tracking-tight leading-none text-center">
                {current.map.name}
              </span>

              {current.side && (
                <div className="flex gap-6 mt-2">
                  <span className="text-[0.9rem] text-muted">
                    ⚔ 선공 <strong className="text-warn">{current.side.first}</strong>
                  </span>
                  <span className="text-[0.9rem] text-muted">
                    🛡 후공 <strong className="text-tank-t">{current.side.second}</strong>
                  </span>
                </div>
              )}

              {needsSideChoice && (
                <div className="flex flex-col items-center gap-2.5 mt-1 w-full">
                  <span className="text-[0.8rem] text-muted">선공 팀을 선택하세요</span>
                  <div className="flex gap-3">
                    <button
                      className="text-[0.85rem] font-semibold px-5 py-2 rounded-lg border border-warn/50 text-warn hover:bg-warn/10 transition-all font-[inherit]"
                      onClick={() => setCurrent((c) => c && { ...c, side: { first: '팀 A', second: '팀 B' } })}
                    >
                      ⚔ 팀 A 선공
                    </button>
                    <button
                      className="text-[0.85rem] font-semibold px-5 py-2 rounded-lg border border-tank-t/50 text-tank-t hover:bg-tank-t/10 transition-all font-[inherit]"
                      onClick={() => setCurrent((c) => c && { ...c, side: { first: '팀 B', second: '팀 A' } })}
                    >
                      🛡 팀 B 선공
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {current && !spinning && !needsSideChoice && (
          <Button className="py-[11px] text-[0.9rem] w-full" onClick={confirm}>
            이 맵 진행하기 →
          </Button>
        )}
      </Card>

      <Dialog
        open={showManual}
        onOpenChange={setShowManual}
        title="맵 직접 선택"
        maxWidth="480px"
      >
        <div className="flex flex-col gap-3 px-5 py-4 max-h-[60vh] overflow-y-auto">
          {available.length === 0 && (
            <p className="text-[0.88rem] text-faint text-center py-4">
              선택 가능한 맵이 없습니다.
            </p>
          )}
          {ALL_MODES.map((mode) => {
            const maps = mapsByMode[mode] ?? [];
            if (maps.length === 0) return null;
            return (
              <div key={mode} className="flex flex-col gap-1.5">
                <MapModeBadge mode={mode} className="text-[0.7rem] px-2 py-0.5 self-start" />
                <div className="flex flex-wrap gap-1.5">
                  {maps.map((m) => (
                    <button
                      key={m.name}
                      className="text-[0.8rem] font-semibold px-3 py-1.5 rounded-lg bg-surface border border-line text-sub hover:border-purple hover:text-lilac transition-all font-[inherit]"
                      onClick={() => pickManual(m)}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Dialog>
    </div>
  );
}
