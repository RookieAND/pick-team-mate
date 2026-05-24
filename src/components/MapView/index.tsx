import { useAppStore } from '../../store';
import MapDraw from './MapDraw';
import MapHistory from './MapHistory';

export default function MapView() {
  const setStep = useAppStore((s) => s.setStep);

  return (
    <div className="w-full max-w-[900px] flex flex-col flex-1">
      <div className="flex-1 px-6 pt-8 pb-4 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="section-title">맵 뽑기</h2>
          <p className="section-desc mt-1">진행할 맵을 추첨하고 결과를 기록하세요.</p>
        </div>

        <MapDraw />
        <MapHistory />
      </div>

      <div className="sticky bottom-0 z-10 w-full bg-base/95 backdrop-blur-sm border-t border-line/20 px-6 py-4 flex gap-2">
        <button className="btn-secondary py-[14px]! flex-1!" onClick={() => setStep('result')}>
          ← 역할 배정으로
        </button>
        <button className="btn-primary py-[14px]! flex-[2]!" onClick={() => setStep('done')}>
          결과 확인 →
        </button>
      </div>
    </div>
  );
}
