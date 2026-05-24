import type { AppStep } from '../../types';

const STEPS = [
  { key: 'input',  label: '정보 입력' },
  { key: 'teams',  label: '팀 배정' },
  { key: 'result', label: '역할 배정' },
  { key: 'map',    label: '맵 뽑기' },
] as const;

const STEP_IDX: Partial<Record<AppStep, number>> = {
  input: 0, teams: 1, result: 2, map: 3, done: 4,
};

export default function StepIndicator({ current }: { current: AppStep }) {
  const currentIdx = STEP_IDX[current] ?? 0;
  return (
    <div className="step-indicator">
      {STEPS.map((s, i) => (
        <div
          key={s.key}
          className={`step ${i <= currentIdx ? 'active' : ''} ${i < currentIdx ? 'done' : ''}`}
        >
          <div className="step-dot">{i < currentIdx ? '✓' : i + 1}</div>
          <span className="step-label">{s.label}</span>
          {i < STEPS.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
}
