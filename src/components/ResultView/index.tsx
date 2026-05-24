import { useRef, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import html2canvas from 'html2canvas';
import { useAppStore } from '../../store';
import MapPicker from '../MapPicker';
import TeamResult from './TeamResult';

export default function ResultView() {
  const { resultA, resultB, settings, reset } = useAppStore(
    useShallow((s) => ({
      resultA: s.resultA,
      resultB: s.resultB,
      settings: s.settings,
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
    const canvas = await html2canvas(captureRef.current, { backgroundColor: '#0f0f1a', scale: 2 });
    const link = document.createElement('a');
    link.download = 'team-result.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div ref={viewRef} className="w-full max-w-[900px] px-6 py-8 flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="section-title">배정 완료!</h2>
        <p className="section-desc mt-1">모든 팀원의 역할이 배정되었습니다.</p>
      </div>

      <div className="w-full flex flex-col gap-4 p-4 bg-base rounded-2xl">
        <div ref={captureRef} className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
          <TeamResult
            players={resultA}
            label="A"
            showMost={settings.useMost}
            showBan={settings.useBan}
          />
          <TeamResult
            players={resultB}
            label="B"
            showMost={settings.useMost}
            showBan={settings.useBan}
          />
        </div>
        <MapPicker teamAName="팀 A" teamBName="팀 B" />
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <button className="btn-icon" onClick={download}>
          📷 이미지 저장
        </button>
        <button className="btn-primary" onClick={reset}>
          처음부터 다시 →
        </button>
      </div>
    </div>
  );
}
