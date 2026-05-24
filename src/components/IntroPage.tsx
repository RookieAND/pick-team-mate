import { useAppStore } from '../store';

const FEATURES = [
  { icon: '🔀', label: '랜덤 팀 배정', desc: '10명을 공정하게 5:5로 분리' },
  { icon: '🪜', label: '사다리타기', desc: '탱·딜·힐 역할을 사다리로 결정' },
  { icon: '🏆', label: '모스트 영웅', desc: '포지션별 주력 영웅 최대 3개 입력' },
  { icon: '🚫', label: '역할 밴', desc: '잘하는 역할을 추첨에서 제외' },
];

export default function IntroPage() {
  const setStep = useAppStore(s => s.setStep);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden px-6 py-16">

      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none intro-glow-top" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none intro-glow-bl" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none intro-glow-br" />

      {/* Role badges */}
      <div className="flex gap-3 mb-10 intro-badges">
        <span className="badge-tank text-sm px-3 py-1 intro-float-1">🛡 탱커</span>
        <span className="badge-dps  text-sm px-3 py-1 intro-float-2">⚔ 딜러</span>
        <span className="badge-heal text-sm px-3 py-1 intro-float-3">💚 힐러</span>
      </div>

      {/* Title */}
      <div className="text-center intro-title mb-4">
        <h1 className="intro-main-title">팀 역할 배정기</h1>
        <p className="text-[1.05rem] text-muted mt-3 leading-relaxed">
          오버워치 10인 5:5 · 랜덤 팀 나누기 + 사다리타기 역할 배정
        </p>
      </div>

      {/* CTA */}
      <button
        className="btn-primary text-lg px-14 py-4 mt-2 mb-14 intro-cta"
        onClick={() => setStep('input')}
      >
        시작하기 →
      </button>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md intro-features">
        {FEATURES.map(f => (
          <div key={f.label} className="card px-4 py-3.5 flex flex-col gap-1 hover:border-purple transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-xl">{f.icon}</span>
              <span className="text-[0.85rem] font-bold text-lilac">{f.label}</span>
            </div>
            <p className="text-[0.72rem] text-muted leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
