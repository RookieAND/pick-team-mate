import { useAppStore } from '../store';

const FEATURES = [
  { icon: '🔀', label: '랜덤 팀 배정', desc: '10명을 공정하게 5:5로 분리' },
  { icon: '🪜', label: '사다리타기', desc: '탱·딜·힐 역할을 사다리로 결정' },
  { icon: '🏆', label: '모스트 영웅', desc: '포지션별 주력 영웅 최대 3개 입력' },
  { icon: '🚫', label: '역할 밴', desc: '잘하는 역할을 추첨에서 제외' },
];

export default function IntroPage() {
  const setStep = useAppStore((s) => s.setStep);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden px-6 py-16">
      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Grid */}
        <div className="absolute inset-0 intro-grid" />

        {/* Aurora blobs */}
        <div className="absolute intro-blob intro-blob-purple" />
        <div className="absolute intro-blob intro-blob-tank" />
        <div className="absolute intro-blob intro-blob-dps" />
        <div className="absolute intro-blob intro-blob-heal" />

        {/* Vignette */}
        <div className="absolute inset-0 intro-vignette" />

        {/* Top neon line */}
        <div className="absolute top-0 left-0 right-0 h-px intro-neon-line" />
      </div>

      {/* ── Content ── */}

      {/* Role badges */}
      <div className="flex gap-3 mb-10 intro-badges">
        <span className="badge-tank text-sm px-3 py-1.5 intro-float-1">🛡 탱커</span>
        <span className="badge-dps  text-sm px-3 py-1.5 intro-float-2">⚔ 딜러</span>
        <span className="badge-heal text-sm px-3 py-1.5 intro-float-3">💚 힐러</span>
      </div>

      {/* Title */}
      <div className="text-center intro-title mb-4">
        <h1 className="intro-main-title">팀 역할 배정기</h1>
        <p className="text-[1.05rem] text-muted mt-4 leading-relaxed">
          오버워치 10인 5:5 · 랜덤 팀 나누기 + 사다리타기 역할 배정
        </p>
      </div>

      {/* CTA */}
      <button
        className="btn-primary text-[1.1rem]! px-16! py-4! mt-3 mb-14 intro-cta intro-cta-glow"
        onClick={() => setStep('input')}
      >
        시작하기 →
      </button>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md intro-features">
        {FEATURES.map((f) => (
          <div
            key={f.label}
            className="card px-4 py-3.5 flex flex-col gap-1.5 hover:border-purple transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)]"
          >
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
