import { useRef, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { useAppStore } from '../../store';
import { Button, PageHeader, PageFooter } from '../../ui';
import TeamResult from './TeamResult';

export default function ResultView() {
  const { resultA, resultB, setStep } = useAppStore(
    useShallow((s) => ({
      resultA: s.resultA,
      resultB: s.resultB,
      setStep: s.setStep,
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
        <PageHeader
          title="배정 완료!"
          desc="모든 팀원의 역할이 배정되었습니다."
          titleClassName="page-title"
          descClassName="page-desc"
        />

        <div ref={captureRef} className="w-full">
          <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
            <TeamResult players={resultA} label="A" cardDelay={0.22} />
            <TeamResult players={resultB} label="B" cardDelay={0.36} />
          </div>
        </div>
      </div>

      <PageFooter className="page-actions">
        <Button variant="icon" size="lg" className="flex-1" onClick={download}>
          이미지 저장
        </Button>
        <Button size="xl" className="flex-[2]" onClick={() => setStep('map')}>
          맵 뽑기
        </Button>
      </PageFooter>
    </div>
  );
}
