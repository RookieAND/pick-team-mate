import { useRef, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { useAppStore } from '../../store';
import TeamResult from './TeamResult';
import type { PlayedMap } from '../../types';

const MODE_COLOR: Record<string, string> = {
  점령: '#3b82f6', 호위: '#f59e0b', 혼합: '#a855f7',
  밀기: '#22c55e', 플래시포인트: '#ef4444', 섬멸: '#ec4899',
};

function WinnerLabel({ winner }: { winner: PlayedMap['winner'] }) {
  if (!winner) return <span className="text-[0.72rem] text-faint">미기록</span>;
  if (winner === 'draw') return <span className="text-[0.72rem] text-lavender font-bold">무승부</span>;
  return (
    <span
      className={`text-[0.72rem] font-bold ${winner === 'A' ? 'text-tank-t' : 'text-dps-t'}`}
    >
      팀 {winner} 승
    </span>
  );
}

export default function ResultView() {
  const { resultA, resultB, mapHistory, reset } = useAppStore(
    useShallow((s) => ({
      resultA: s.resultA,
      resultB: s.resultB,
      mapHistory: s.mapHistory,
      reset: s.reset,
    }))
  );

  const captureRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const download = async () => {
    if (!captureRef.current) return;
    try {
      await document.fonts.ready;
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#0f0f1a',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = 'team-result.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      toast.error('이미지 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div ref={viewRef} className="w-full max-w-[900px] flex flex-col flex-1">
      <div className="flex-1 px-6 pt-8 pb-4 flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="section-title">배정 완료!</h2>
          <p className="section-desc mt-1">모든 팀원의 역할이 배정되었습니다.</p>
        </div>

        <div ref={captureRef} className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
            <TeamResult players={resultA} label="A" />
            <TeamResult players={resultB} label="B" />
          </div>

          {mapHistory.length > 0 && (
            <div className="card px-5 py-4 flex flex-col gap-2.5">
              <span className="text-[0.88rem] font-bold text-muted uppercase tracking-wide">
                맵 진행 기록
              </span>
              <div className="flex flex-col gap-1.5">
                {mapHistory.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-2 flex-wrap py-1 border-b border-line/20 last:border-0"
                  >
                    <span className="text-[0.65rem] text-muted w-4 text-right">{idx + 1}</span>
                    <span
                      className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap"
                      style={{ background: MODE_COLOR[entry.mode] ?? '#555' }}
                    >
                      {entry.mode}
                    </span>
                    <span className="font-semibold text-[0.88rem] flex-1 min-w-0 truncate">
                      {entry.name}
                    </span>
                    {entry.side && (
                      <span className="text-[0.72rem] text-muted whitespace-nowrap">
                        선공 <strong className="text-warn">{entry.side.first}</strong>
                      </span>
                    )}
                    <WinnerLabel winner={entry.winner} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 w-full bg-base/95 backdrop-blur-sm border-t border-line/20 px-6 py-4 flex gap-2">
        <button className="btn-icon py-[14px]! flex-1!" onClick={download}>
          📷 이미지 저장
        </button>
        <button className="btn-primary py-[17px]! text-[1.05rem]! flex-[2]!" onClick={reset}>
          처음부터 다시 →
        </button>
      </div>
    </div>
  );
}
