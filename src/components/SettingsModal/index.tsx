import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store';
import { Dialog } from '../../ui';
import SettingRow from './SettingRow';

export default function SettingsModal() {
  const { showSettings, settings, setUseMost, setUseBan, setUse6v6, setShowSettings } = useAppStore(
    useShallow((s) => ({
      showSettings: s.showSettings,
      settings: s.settings,
      setUseMost: s.setUseMost,
      setUseBan: s.setUseBan,
      setUse6v6: s.setUse6v6,
      setShowSettings: s.setShowSettings,
    }))
  );

  return (
    <Dialog
      open={showSettings}
      onOpenChange={(v) => !v && setShowSettings(false)}
      title="설정"
      maxWidth="400px"
    >
      <div className="flex flex-col gap-2.5 px-5 py-4">
        <SettingRow
          label="역할 모스트"
          desc="포지션별 모스트 영웅 입력 활성화"
          checked={settings.useMost}
          onCheckedChange={setUseMost}
        />
        <SettingRow
          label="역할 밴"
          desc="너무 잘해서 제외할 역할 선택 활성화"
          checked={settings.useBan}
          onCheckedChange={setUseBan}
        />
        <SettingRow
          label="6:6 모드"
          desc="12명으로 진행 (탱×2 딜×2 힐×2) — 변경 시 처음부터 시작"
          checked={settings.use6v6}
          onCheckedChange={setUse6v6}
        />
      </div>
    </Dialog>
  );
}
