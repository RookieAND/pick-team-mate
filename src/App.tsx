import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from './store';
import PlayerInputForm from './components/PlayerInputForm';
import TeamSplit from './components/TeamSplit';
import RoleAssignment from './components/RoleAssignment';
import ResultView from './components/ResultView';
import SettingsModal from './components/SettingsModal';
import type { AppStep } from './types';
import './App.css';

function StepIndicator({ current }: { current: AppStep }) {
  const labels = [
    { key: 'input', label: '정보 입력' },
    { key: 'teams', label: '팀 배정' },
    { key: 'result', label: '역할 배정' },
  ] as const;
  const currentIdx = labels.findIndex(s => s.key === current);
  return (
    <div className="step-indicator">
      {labels.map((s, i) => (
        <div key={s.key} className={`step ${i <= currentIdx ? 'active' : ''} ${i < currentIdx ? 'done' : ''}`}>
          <div className="step-dot">{i < currentIdx ? '✓' : i + 1}</div>
          <span className="step-label">{s.label}</span>
          {i < labels.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const { step, resultA, resultB, setShowSettings } = useAppStore(useShallow(s => ({
    step: s.step,
    resultA: s.resultA,
    resultB: s.resultB,
    setShowSettings: s.setShowSettings,
  })));

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <header className="w-full flex flex-col items-center gap-1.5 px-6 pt-8 pb-6"
        style={{ background: 'linear-gradient(180deg, #12012f 0%, transparent 100%)' }}>
        <div className="w-full relative flex justify-center">
          <div className="text-center">
            <h1 className="app-title">팀 역할 배정기</h1>
            <p className="text-[0.85rem] text-dim mb-3">10인 5:5 팀 나누기 + 사다리타기 역할 배정</p>
          </div>
          <button
            className="absolute right-0 top-1 bg-surface border border-line rounded-lg text-muted text-[0.82rem] font-semibold px-3.5 py-1.5 transition-all hover:border-purple hover:text-lilac"
            onClick={() => setShowSettings(true)}
          >
            ⚙ 설정
          </button>
        </div>
        <StepIndicator current={step} />
      </header>

      <main className="w-full flex flex-col items-center flex-1">
        {step === 'input' && <PlayerInputForm />}
        {step === 'teams' && <TeamSplit />}
        {step === 'result' && (
          resultA.length > 0 && resultB.length > 0
            ? <ResultView />
            : <RoleAssignment />
        )}
      </main>

      <SettingsModal />
    </div>
  );
}
