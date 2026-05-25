import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store';
import { Button, Text } from '../../ui';
import MapDraw from './MapDraw';
import MapHistory from './MapHistory';

export default function MapView() {
  const { setStep, reset } = useAppStore(
    useShallow((s) => ({ setStep: s.setStep, reset: s.reset }))
  );

  return (
    <div className="w-full max-w-[900px] flex flex-col flex-1">
      <div className="flex-1 px-6 pt-8 pb-4 flex flex-col gap-6">
        <div className="text-center">
          <Text as="h2" variant="section-title">맵 뽑기</Text>
          <Text variant="section-desc" className="mt-1">진행할 맵을 추첨하고 결과를 기록하세요.</Text>
        </div>

        <MapDraw />
        <MapHistory />
      </div>

      <div className="sticky bottom-0 z-10 w-full bg-base/95 backdrop-blur-sm border-t border-line/20 px-6 py-4 flex gap-2">
        <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep('done')}>
          ← 배정 결과로
        </Button>
        <Button size="lg" className="flex-[2]" onClick={reset}>
          처음부터 다시 →
        </Button>
      </div>
    </div>
  );
}
