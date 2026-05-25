export const MODE_COLOR: Record<string, string> = {
  점령: '#3b82f6',
  호위: '#f59e0b',
  혼합: '#a855f7',
  밀기: '#22c55e',
  플래시포인트: '#ef4444',
  섬멸: '#ec4899',
};

interface MapModeBadgeProps {
  mode: string;
  className?: string;
}

export function MapModeBadge({
  mode,
  className = 'text-[0.75rem] px-3 py-0.5',
}: MapModeBadgeProps) {
  return (
    <span
      className={`font-bold rounded-full text-white whitespace-nowrap ${className}`}
      style={{ background: MODE_COLOR[mode] ?? '#555' }}
    >
      {mode}
    </span>
  );
}
