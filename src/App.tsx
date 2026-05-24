import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from './store';
import IntroPage from './components/IntroPage';
import PlayerInputForm from './components/PlayerInputForm';
import TeamSplit from './components/TeamSplit';
import RoleAssignment from './components/RoleAssignment';
import ResultView from './components/ResultView';
import SettingsModal from './components/SettingsModal';
import PresetDialog from './components/PresetDialog';
import StepIndicator from './components/StepIndicator';
import './App.css';

export default function App() {
  const { step, resultA, resultB, setShowSettings, setShowPreset } = useAppStore(
    useShallow((s) => ({
      step: s.step,
      resultA: s.resultA,
      resultB: s.resultB,
      setShowSettings: s.setShowSettings,
      setShowPreset: s.setShowPreset,
    }))
  );

  if (step === 'intro') {
    return (
      <>
        <IntroPage />
        <SettingsModal />
      </>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <header className="sticky top-0 z-50 w-full flex flex-col items-center gap-1.5 px-6 pt-6 pb-4 bg-[#0c0c1e] backdrop-blur-md border-b border-line/40 shrink-0">
        <div className="w-full relative flex justify-center">
          <div className="text-center">
            <h1 className="app-title">팀 역할 배정기</h1>
            <p className="text-[0.85rem] text-dim mb-3">
              10인 5:5 팀 나누기 + 사다리타기 역할 배정
            </p>
          </div>
          <div className="absolute right-0 top-0 flex flex-col gap-1.5">
            <button
              className="bg-surface border border-line rounded-lg text-muted text-[0.82rem] font-semibold px-3.5 py-1.5 transition-all hover:border-purple hover:text-lilac"
              onClick={() => setShowSettings(true)}
            >
              ⚙ 설정
            </button>
            <button
              className="bg-surface border border-line rounded-lg text-muted text-[0.82rem] font-semibold px-3.5 py-1.5 transition-all hover:border-purple hover:text-lilac"
              onClick={() => setShowPreset(true)}
            >
              📋 프리셋
            </button>
          </div>
        </div>
        <StepIndicator current={step} />
      </header>

      <main className="flex-1 overflow-y-auto flex flex-col items-center">
        {step === 'input' && <PlayerInputForm />}
        {step === 'teams' && <TeamSplit />}
        {step === 'result' &&
          (resultA.length > 0 && resultB.length > 0 ? <ResultView /> : <RoleAssignment />)}
      </main>

      <SettingsModal />
      <PresetDialog />
    </div>
  );
}
