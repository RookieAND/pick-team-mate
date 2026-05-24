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
      <header className="sticky top-0 z-50 w-full flex flex-col gap-3 px-6 pt-4 pb-3 bg-base/90 backdrop-blur-md border-b border-line/20 shrink-0">
        <div className="w-full flex items-center justify-between">
          <h1 className="app-title text-[1.15rem]!">빠치마리</h1>
          <div className="flex gap-2">
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
