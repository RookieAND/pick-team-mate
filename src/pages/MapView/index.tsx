import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store';
import { Button, Layout } from '../../ui';
import MapDraw from './MapDraw';
import MapHistory from './MapHistory';
import MapSettingsDialog from './MapSettings';

export default function MapView() {
  const { setStep, reset } = useAppStore(
    useShallow((s) => ({ setStep: s.setStep, reset: s.reset }))
  );
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Layout.Root maxWidth="900px">
      <Layout.Body>
        <Layout.Header
          title="맵 뽑기"
          desc="진행할 맵을 추첨하고 결과를 기록하세요."
          action={
            <Button variant="ghost" size="xs" onClick={() => setShowSettings(true)}>
              설정
            </Button>
          }
        />
        <MapDraw />
        <MapHistory />
        <MapSettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      </Layout.Body>

      <Layout.Footer>
        <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep('done')}>
          이전
        </Button>
        <Button size="lg" className="flex-[2]" onClick={reset}>
          처음으로
        </Button>
      </Layout.Footer>
    </Layout.Root>
  );
}
