import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store';
import { Card, Switch, Text } from '../../ui';

const ALL_MODES = ['점령', '호위', '혼합', '밀기', '플래시포인트', '섬멸'] as const;

export default function MapSettings() {
  const { mapSettings, setMapSettings } = useAppStore(
    useShallow((s) => ({
      mapSettings: s.mapSettings,
      setMapSettings: s.setMapSettings,
    }))
  );

  const toggleMode = (mode: string) => {
    const excluded = mapSettings.excludedModes;
    setMapSettings({
      excludedModes: excluded.includes(mode)
        ? excluded.filter((m) => m !== mode)
        : [...excluded, mode],
    });
  };

  return (
    <Card className="px-5 py-4 flex flex-col gap-4">
      <Text as="span" variant="label">맵 설정</Text>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <Switch
          checked={mapSettings.preventDuplicates}
          onCheckedChange={(v) => setMapSettings({ preventDuplicates: v })}
        />
        <span className="text-[0.88rem] text-sub">중복 방지 (진행한 맵 제외)</span>
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-[0.8rem] text-muted">제외할 모드</span>
        <div className="flex flex-wrap gap-2">
          {ALL_MODES.map((mode) => {
            const excluded = mapSettings.excludedModes.includes(mode);
            return (
              <button
                key={mode}
                onClick={() => toggleMode(mode)}
                className={[
                  'text-[0.78rem] font-semibold px-3 py-1 rounded-full border transition-all',
                  excluded
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
    </Card>
  );
}
