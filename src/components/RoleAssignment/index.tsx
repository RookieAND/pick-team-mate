import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { AssignedPlayer } from '../../types';
import { useAppStore } from '../../store';
import TeamLadder from './TeamLadder';
import './RoleAssignment.css';

export default function RoleAssignment() {
  const { teamA, teamB, settings, setResult, setStep } = useAppStore(
    useShallow((s) => ({
      teamA: s.teamA,
      teamB: s.teamB,
      settings: s.settings,
      setResult: s.setResult,
      setStep: s.setStep,
    }))
  );

  const [doneA, setDoneA] = useState<AssignedPlayer[] | null>(null);
  const [doneB, setDoneB] = useState<AssignedPlayer[] | null>(null);

  useEffect(() => {
    if (doneA && doneB) setResult(doneA, doneB);
  }, [doneA, doneB, setResult]);

  return (
    <div className="w-full max-w-[1100px] px-6 py-8 flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="section-title">사다리타기 역할 배정</h2>
        <p className="section-desc mt-1">각 팀의 사다리 시작 버튼을 눌러 역할을 배정하세요.</p>
      </div>
      <div className="ladders-wrap grid grid-cols-2 gap-6 w-full">
        <TeamLadder players={teamA} label="A" useBan={settings.useBan} onDone={setDoneA} />
        <TeamLadder players={teamB} label="B" useBan={settings.useBan} onDone={setDoneB} />
      </div>
      <button className="btn-secondary" onClick={() => setStep('teams')}>
        ← 팀 다시 나누기
      </button>
    </div>
  );
}
