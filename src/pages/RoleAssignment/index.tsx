import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { AssignedPlayer } from '../../types';
import { useAppStore } from '../../store';
import { Button, PageHeader, PageFooter } from '../../ui';
import TeamLadder from './TeamLadder';
import './RoleAssignment.css';

export default function RoleAssignment() {
  const { teamA, teamB, confirmRoles, setStep } = useAppStore(
    useShallow((s) => ({
      teamA: s.teamA,
      teamB: s.teamB,
      confirmRoles: s.confirmRoles,
      setStep: s.setStep,
    }))
  );

  const [doneA, setDoneA] = useState<AssignedPlayer[] | null>(null);
  const [doneB, setDoneB] = useState<AssignedPlayer[] | null>(null);

  const canConfirm = !!doneA && !!doneB;

  return (
    <div className="w-full max-w-[1100px] flex flex-col flex-1">
      <div className="flex-1 px-6 pt-8 pb-4 flex flex-col items-center gap-6">
        <PageHeader
          title="사다리타기 역할 배정"
          desc="각 팀의 사다리 시작 버튼을 눌러 역할을 배정하세요."
          titleClassName="page-title"
          descClassName="page-desc"
        />
        <div className="ladders-wrap grid grid-cols-2 gap-6 w-full">
          <div className="page-card" style={{ '--card-delay': '0.28s' } as CSSProperties}>
            <TeamLadder
              players={teamA}
              label="A"
              onDone={setDoneA}
              onReset={() => setDoneA(null)}
            />
          </div>
          <div className="page-card" style={{ '--card-delay': '0.4s' } as CSSProperties}>
            <TeamLadder
              players={teamB}
              label="B"
              onDone={setDoneB}
              onReset={() => setDoneB(null)}
            />
          </div>
        </div>
      </div>

      <PageFooter className="page-actions">
        <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep('teams')}>
          이전
        </Button>
        {canConfirm && (
          <Button size="lg" className="flex-[2]" onClick={() => confirmRoles(doneA!, doneB!)}>
            배정 확인
          </Button>
        )}
      </PageFooter>
    </div>
  );
}
