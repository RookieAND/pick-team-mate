import * as Switch from '@radix-ui/react-switch';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store';
import { Dialog } from '../../ui';

function SettingRow({
  label,
  desc,
  checked,
  onCheckedChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 bg-base border border-line rounded-xl px-3.5 py-3">
      <div className="flex flex-col gap-1">
        <span className="text-[0.88rem] font-bold text-text">{label}</span>
        <span className="text-[0.72rem] text-dim">{desc}</span>
      </div>
      <Switch.Root
        className="w-10 h-[22px] rounded-full border-none p-0 cursor-pointer relative transition-colors shrink-0 data-[state=checked]:bg-purple bg-line"
        checked={checked}
        onCheckedChange={onCheckedChange}
      >
        <Switch.Thumb className="block w-4 h-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-[21px] translate-x-[3px] will-change-transform" />
      </Switch.Root>
    </div>
  );
}

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
