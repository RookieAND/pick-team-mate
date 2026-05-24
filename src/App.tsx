import { useState } from 'react';
import type { Player, AssignedPlayer, AppStep } from './types';
import PlayerInputForm from './components/PlayerInputForm';
import TeamSplit from './components/TeamSplit';
import RoleAssignment from './components/RoleAssignment';
import ResultView from './components/ResultView';
import './App.css';

function makeDefaultPlayers(): Player[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: String(i),
    name: '',
    most: ['dps', 'heal', 'tank'],
    banned: [],
  }));
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
  const [step, setStep] = useState<AppStep>('input');
  const [players, setPlayers] = useState<Player[]>(makeDefaultPlayers);
  const [teamA, setTeamA] = useState<Player[]>([]);
  const [teamB, setTeamB] = useState<Player[]>([]);
  const [resultA, setResultA] = useState<AssignedPlayer[]>([]);
  const [resultB, setResultB] = useState<AssignedPlayer[]>([]);

  const handleTeamsConfirmed = (a: Player[], b: Player[]) => {
    setTeamA(a);
    setTeamB(b);
    setStep('result');
  };

  const handleResult = (a: AssignedPlayer[], b: AssignedPlayer[]) => {
    setResultA(a);
    setResultB(b);
  };

  const handleReset = () => {
    setPlayers(makeDefaultPlayers());
    setTeamA([]);
    setTeamB([]);
    setResultA([]);
    setResultB([]);
    setStep('input');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">팀 역할 배정기</h1>
        <p className="app-subtitle">10인 5:5 팀 나누기 + 사다리타기 역할 배정</p>
        <StepIndicator current={step} />
      </header>

      <main className="app-main">
        {step === 'input' && (
          <PlayerInputForm
            players={players}
            onChange={setPlayers}
            onNext={() => setStep('teams')}
          />
        )}
        {step === 'teams' && (
          <TeamSplit
            players={players}
            onConfirm={handleTeamsConfirmed}
            onBack={() => setStep('input')}
          />
        )}
        {step === 'result' && (
          <>
            <RoleAssignment
              teamA={teamA}
              teamB={teamB}
              onResult={handleResult}
              onBack={() => setStep('teams')}
            />
            {resultA.length > 0 && resultB.length > 0 && (
              <ResultView
                teamA={resultA}
                teamB={resultB}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
