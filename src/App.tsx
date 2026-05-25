import { useShallow } from 'zustand/react/shallow';
import { Settings, BookMarked } from 'lucide-react';
import { useAppStore } from './store';
import IntroPage from './pages/IntroPage';
import PlayerInputForm from './pages/PlayerInputForm';
import TeamSplit from './pages/TeamSplit';
import RoleAssignment from './pages/RoleAssignment';
import MapView from './pages/MapView';
import ResultView from './pages/ResultView';
import SettingsModal from './components/SettingsModal';
import PresetDialog from './components/PresetDialog';
import StepIndicator from './components/StepIndicator';

export default function App() {
  const { step, setShowSettings, setShowPreset } = useAppStore(
    useShallow((s) => ({
      step: s.step,
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
          <h1 className="text-[1.15rem] font-extrabold bg-gradient-to-br from-[#a78bfa] via-[#c084fc] to-[#f0abfc] bg-clip-text text-transparent">빠치마리</h1>
          <div className="flex gap-2">
            <button
              className="bg-surface border border-line rounded-lg text-muted text-[0.82rem] font-semibold px-3 py-1.5 transition-all hover:border-purple hover:text-lilac flex items-center gap-1.5"
              onClick={() => setShowSettings(true)}
            >
              <Settings size={14} />
              설정
            </button>
            <button
              className="bg-surface border border-line rounded-lg text-muted text-[0.82rem] font-semibold px-3 py-1.5 transition-all hover:border-purple hover:text-lilac flex items-center gap-1.5"
              onClick={() => setShowPreset(true)}
            >
              <BookMarked size={14} />
              프리셋
            </button>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <StepIndicator current={step} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto flex flex-col items-center">
        {step === 'input'  && <PlayerInputForm />}
        {step === 'teams'  && <TeamSplit />}
        {step === 'result' && <RoleAssignment />}
        {step === 'map'    && <MapView />}
        {step === 'done'   && <ResultView />}
      </main>

      <SettingsModal />
      <PresetDialog />
    </div>
  );
}
