import type { AppStep } from '../../types';

const STEPS = [
  { key: 'input',  label: '정보 입력' },
  { key: 'teams',  label: '팀 배정' },
  { key: 'result', label: '역할 배정' },
  { key: 'map',    label: '맵 뽑기' },
] as const;

const STEP_IDX: Partial<Record<AppStep, number>> = {
  input: 0, teams: 1, result: 2, done: 3, map: 3,
};

export default function StepIndicator({ current }: { current: AppStep }) {
  const currentIdx = STEP_IDX[current] ?? 0;
  return (
    <div className="flex items-center mt-3 sm:mt-2">
      {STEPS.map((s, i) => {
        const isDone   = i < currentIdx;
        const isActive = i === currentIdx;
        const stepCls = [
          'flex items-center gap-1.5 sm:gap-1 transition-colors duration-300',
          isDone   ? 'text-purple' : isActive ? 'text-lilac' : 'text-faint',
        ].join(' ');
        const dotCls = [
          'w-[26px] h-[26px] sm:w-6 sm:h-6 rounded-full border-2 border-current flex items-center justify-center text-[0.72rem] sm:text-[0.68rem] font-bold transition-colors duration-300 shrink-0',
          isDone   ? 'bg-purple text-white' :
          isActive ? 'bg-indigo' :
                     'bg-base',
        ].join(' ');
        return (
          <div key={s.key} className={stepCls}>
            <div className={dotCls}>{isDone ? '✓' : i + 1}</div>
            <span className="text-[0.8rem] font-semibold hidden sm:block">{s.label}</span>
            {i < STEPS.length - 1 && (
              <div className="w-10 sm:w-[22px] h-0.5 bg-[#333] mx-1.5 sm:mx-[3px] shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
