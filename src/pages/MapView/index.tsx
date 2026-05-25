import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store';
import { Button, PageHeader, PageFooter } from '../../ui';
import MapDraw from './MapDraw';
import MapHistory from './MapHistory';

export default function MapView() {
  const { setStep, reset } = useAppStore(
    useShallow((s) => ({ setStep: s.setStep, reset: s.reset }))
  );

  return (
    <div className="w-full max-w-[900px] flex flex-col flex-1">
      <div className="flex-1 px-6 pt-8 pb-4 flex flex-col gap-6">
        <PageHeader title="맵 뽑기" desc="진행할 맵을 추첨하고 결과를 기록하세요." />

        <MapDraw />
        <MapHistory />
      </div>

      <PageFooter>
        <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep('done')}>
          이전
        </Button>
        <Button size="lg" className="flex-[2]" onClick={reset}>
          처음으로
        </Button>
      </PageFooter>
    </div>
  );
}
