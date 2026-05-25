import { useState, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { sample, groupBy } from 'es-toolkit';
import { OW_MAPS, HAS_SIDE, type OWMap } from '../../data/maps';
import { useAppStore } from '../../store';
import { Button, Card, Switch } from '../../ui';

const ALL_MODES = ['점령', '호위', '혼합', '밀기', '플래시포인트', '섬멸'] as const;

const MODE_COLOR: Record<string, string> = {
  점령: '#3b82f6', 호위: '#f59e0b', 혼합: '#a855f7',
  밀기: '#22c55e', 플래시포인트: '#ef4444', 섬멸: '#ec4899',
};

type CurrentDraw = { map: OWMap; side: { first: string; second: string } | null };

function computeSide(map: OWMap): { first: string; second: string } | null {
  if (!HAS_SIDE.includes(map.mode)) return null;
  const coin = Math.random() < 0.5;
  return { first: coin ? '팀 A' : '팀 B', second: coin ? '팀 B' : '팀 A' };
}

export default function MapDraw() {
  const { mapHistory, mapSettings, addPlayedMap, setMapSettings } = useAppStore(
    useShallow((s) => ({
      mapHistory: s.mapHistory,
      mapSettings: s.mapSettings,
      addPlayedMap: s.addPlayedMap,
      setMapSettings: s.setMapSettings,
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

  const settle = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const map = finalRef.current!;
    finalRef.current = null;
    setDisplayMap(null);
    setCurrent({ map, side: computeSide(map) });
    setSpinning(false);
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
    setCurrent({ map, side: computeSide(map) });
    setShowManual(false);
  };

  const confirm = () => {
    if (!current) return;
    addPlayedMap({ name: current.map.name, mode: current.map.mode, winner: null, side: current.side });
    setCurrent(null);
  };

  const toggleMode = (mode: string) => {
    const excluded = mapSettings.excludedModes;
    setMapSettings({
      excludedModes: excluded.includes(mode)
        ? excluded.filter((m) => m !== mode)
        : [...excluded, mode],
    });
  };

  const mapsByMode = groupBy(available, (m) => m.mode);

  return (
    <div className="flex flex-col gap-4">
      {/* 맵 추첨 카드 */}
      <Card className="px-5 py-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.88rem] font-bold text-muted uppercase tracking-wide">맵 추첨</span>
          <div className="flex gap-2">
            {!spinning && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setShowManual((v) => !v)}
              >
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

        {/* 룰렛 디스플레이 영역 */}
        <div className="flex items-center justify-center min-h-[88px] rounded-xl bg-base border border-line-subtle px-6">
          {!spinning && !current && available.length === 0 && (
            <p className="text-[0.85rem] text-danger">선택 가능한 맵이 없습니다. 설정을 확인해주세요.</p>
          )}
          {!spinning && !current && available.length > 0 && (
            <p className="text-[0.85rem] text-faint">맵 뽑기 버튼을 눌러 추첨을 시작하세요</p>
          )}

          {spinning && displayMap && (
            <div key={tickKey} className="flex flex-col items-center gap-2 slot-in">
              <span
                className="text-[0.75rem] font-bold px-3 py-0.5 rounded-full text-white"
                style={{ background: MODE_COLOR[displayMap.mode] ?? '#555' }}
              >
                {displayMap.mode}
              </span>
              <span className="text-[1.8rem] font-black text-text tracking-tight leading-none">
                {displayMap.name}
              </span>
            </div>
          )}

          {current && !spinning && (
            <div className="flex flex-col items-center gap-2 pop-in w-full">
              <span
                className="text-[0.75rem] font-bold px-3 py-0.5 rounded-full text-white"
                style={{ background: MODE_COLOR[current.map.mode] ?? '#555' }}
              >
                {current.map.mode}
              </span>
              <span className="text-[1.8rem] font-black text-text tracking-tight leading-none">
                {current.map.name}
              </span>
              {current.side && (
                <div className="flex gap-4 mt-1">
                  <span className="text-[0.82rem] text-muted">
                    ⚔ 선공 <strong className="text-warn">{current.side.first}</strong>
                  </span>
                  <span className="text-[0.82rem] text-muted">
                    🛡 후공 <strong className="text-tank-t">{current.side.second}</strong>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {current && !spinning && (
          <Button className="py-[11px] text-[0.9rem] w-full" onClick={confirm}>
            이 맵 진행하기 →
          </Button>
        )}

        {/* 직접 선택 패널 */}
        {showManual && (
          <div className="flex flex-col gap-3 border-t border-line/30 pt-3">
            {ALL_MODES.map((mode) => {
              const maps = mapsByMode[mode] ?? [];
              if (maps.length === 0) return null;
              return (
                <div key={mode} className="flex flex-col gap-1.5">
                  <span
                    className="text-[0.7rem] font-bold px-2 py-0.5 rounded-full text-white self-start"
                    style={{ background: MODE_COLOR[mode] ?? '#555' }}
                  >
                    {mode}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {maps.map((m) => (
                      <button
                        key={m.name}
                        className="text-[0.8rem] font-semibold px-3 py-1.5 rounded-lg bg-surface border border-line text-sub hover:border-purple hover:text-lilac transition-all"
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
        )}
      </Card>

      {/* 설정 카드 */}
      <Card className="px-5 py-4 flex flex-col gap-4">
        <span className="text-[0.88rem] font-bold text-muted uppercase tracking-wide">맵 설정</span>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <Switch
            checked={mapSettings.preventDuplicates}
            onCheckedChange={(v) => setMapSettings({ preventDuplicates: v })}
          />
          <span className="text-[0.88rem] text-sub">중복 방지 (진행한 맵 제외)</span>
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-[0.8rem] text-muted">제외할 모드</span>
          <div className="flex flex-wrap gap-2">
            {ALL_MODES.map((mode) => {
              const excluded = mapSettings.excludedModes.includes(mode);
              return (
                <button
                  key={mode}
                  onClick={() => toggleMode(mode)}
                  className={`text-[0.78rem] font-semibold px-3 py-1 rounded-full border transition-all ${
                    excluded
                      ? 'bg-surface border-faint text-faint line-through'
                      : 'border-line text-sub hover:border-purple hover:text-lilac'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
