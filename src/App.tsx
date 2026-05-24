import { useState } from 'react';
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
  const [showSettings, setShowSettings] = useState(false);
  const { step, settings, players, teamA, teamB, resultA, resultB,
    setStep, setSettings, setPlayers, confirmTeams, setResult, reset } = useAppStore();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="header-titles">
            <h1 className="app-title">팀 역할 배정기</h1>
            <p className="app-subtitle">10인 5:5 팀 나누기 + 사다리타기 역할 배정</p>
          </div>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>
            ⚙ 설정
          </button>
        </div>
        <StepIndicator current={step} />
      </header>

      <main className="app-main">
        {step === 'input' && (
          <PlayerInputForm
            players={players}
            settings={settings}
            onChange={setPlayers}
            onNext={() => setStep('teams')}
          />
        )}
        {step === 'teams' && (
          <TeamSplit
            players={players}
            onConfirm={confirmTeams}
            onBack={() => setStep('input')}
          />
        )}
        {step === 'result' && (
          resultA.length > 0 && resultB.length > 0
            ? <ResultView teamA={resultA} teamB={resultB} settings={settings} onReset={reset} />
            : <RoleAssignment teamA={teamA} teamB={teamB} settings={settings} onResult={setResult} onBack={() => setStep('teams')} />
        )}
      </main>

      <SettingsModal
        open={showSettings}
        settings={settings}
        onChange={setSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
