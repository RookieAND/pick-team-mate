import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { AssignedPlayer } from '../../types';
import { useAppStore } from '../../store';
import { Button, Text } from '../../ui';
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
        <div className="text-center">
          <Text as="h2" variant="section-title">사다리타기 역할 배정</Text>
          <Text variant="section-desc" className="mt-1">각 팀의 사다리 시작 버튼을 눌러 역할을 배정하세요.</Text>
        </div>
        <div className="ladders-wrap grid grid-cols-2 gap-6 w-full">
          <TeamLadder
            players={teamA}
            label="A"
            onDone={setDoneA}
            onReset={() => setDoneA(null)}
          />
          <TeamLadder
            players={teamB}
            label="B"
            onDone={setDoneB}
            onReset={() => setDoneB(null)}
          />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 w-full bg-base/95 backdrop-blur-sm border-t border-line/20 px-6 py-4 flex gap-2">
        <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStep('teams')}>
          ← 팀 다시 나누기
        </Button>
        {canConfirm && (
          <Button size="lg" className="flex-[2]" onClick={() => confirmRoles(doneA!, doneB!)}>
            배정 확인 →
          </Button>
        )}
      </div>
    </div>
  );
}
