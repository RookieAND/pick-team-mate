import { useAppStore } from './store';
import PlayerInputForm from './components/PlayerInputForm';
import TeamSplit from './components/TeamSplit';
import RoleAssignment from './components/RoleAssignment';
import ResultView from './components/ResultView';
import type { AppStep } from './types';
import './App.css';

function Toggle({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button className={`toggle-item ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
      <div className="toggle-text">
        <span className="toggle-label">{label}</span>
        <span className="toggle-desc">{desc}</span>
      </div>
      <div className={`toggle-switch ${value ? 'on' : ''}`}>
        <div className="toggle-thumb" />
      </div>
    </button>
  );
}

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
  const { step, settings, players, teamA, teamB, resultA, resultB,
    setStep, setSettings, setPlayers, confirmTeams, setResult, reset } = useAppStore();

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">팀 역할 배정기</h1>
        <p className="app-subtitle">10인 5:5 팀 나누기 + 사다리타기 역할 배정</p>

        {step === 'input' && (
          <div className="settings-bar">
            <Toggle
              label="역할 모스트"
              desc="포지션별 모스트 영웅 입력"
              value={settings.useMost}
              onChange={v => setSettings({ useMost: v })}
            />
            <Toggle
              label="역할 밴"
              desc="너무 잘해서 제외할 역할 선택"
              value={settings.useBan}
              onChange={v => setSettings({ useBan: v })}
            />
          </div>
        )}

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
          <>
            <RoleAssignment
              teamA={teamA}
              teamB={teamB}
              settings={settings}
              onResult={setResult}
              onBack={() => setStep('teams')}
            />
            {resultA.length > 0 && resultB.length > 0 && (
              <ResultView
                teamA={resultA}
                teamB={resultB}
                settings={settings}
                onReset={reset}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
