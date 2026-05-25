import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store';
import { Dialog, Switch } from '../../ui';

const ALL_MODES = ['점령', '호위', '혼합', '밀기', '플래시포인트', '섬멸'] as const;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MapSettingsDialog({ open, onOpenChange }: Props) {
  const { mapSettings, setMapSettings } = useAppStore(
    useShallow((s) => ({
      mapSettings: s.mapSettings,
      setMapSettings: s.setMapSettings,
    }))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="맵 설정" maxWidth="420px">
      <div className="flex flex-col gap-5 px-5 py-4">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <Switch
            checked={mapSettings.preventDuplicates}
            onCheckedChange={(v) => setMapSettings({ preventDuplicates: v })}
          />
          <span className="text-[0.88rem] text-sub">중복 방지 (진행한 맵 제외)</span>
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-[0.78rem] font-bold text-muted uppercase tracking-wide">
            선공 / 후공 결정
          </span>
          <div className="flex gap-2">
            {(['manual', 'random'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setMapSettings({ sideMode: mode })}
                className={[
                  'flex-1 text-[0.82rem] font-semibold py-2 rounded-lg border transition-all font-[inherit]',
                  mapSettings.sideMode === mode
                    ? 'bg-deep-indigo border-indigo text-lilac'
                    : 'bg-surface border-line text-dim hover:border-purple hover:text-sub',
                ].join(' ')}
              >
                {mode === 'manual' ? '직접 선택' : '랜덤 추출'}
              </button>
            ))}
          </div>
          <p className="text-[0.75rem] text-faint">호위 / 혼합 맵에만 적용됩니다.</p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[0.78rem] font-bold text-muted uppercase tracking-wide">
            제외할 모드
          </span>
          <div className="flex flex-wrap gap-2">
            {ALL_MODES.map((mode) => {
              const isExcluded = mapSettings.excludedModes.includes(mode);
              return (
                <button
                  key={mode}
                  onClick={() =>
                    setMapSettings({
                      excludedModes: isExcluded
                        ? mapSettings.excludedModes.filter((m) => m !== mode)
                        : [...mapSettings.excludedModes, mode],
                    })
                  }
                  className={[
                    'text-[0.78rem] font-semibold px-3 py-1 rounded-full border transition-all',
                    isExcluded
                      ? 'bg-surface border-faint text-faint line-through'
                      : 'border-line text-sub hover:border-purple hover:text-lilac',
                  ].join(' ')}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
