import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import type { AppSettings } from '../types';
import './SettingsModal.css';

interface Props {
  open: boolean;
  settings: AppSettings;
  onChange: (s: Partial<AppSettings>) => void;
  onClose: () => void;
}

function SettingRow({ label, desc, checked, onCheckedChange }: {
  label: string; desc: string; checked: boolean; onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="setting-row">
      <div className="setting-text">
        <span className="setting-label">{label}</span>
        <span className="setting-desc">{desc}</span>
      </div>
      <Switch.Root
        className={`switch-root ${checked ? 'on' : ''}`}
        checked={checked}
        onCheckedChange={onCheckedChange}
      >
        <Switch.Thumb className="switch-thumb" />
      </Switch.Root>
    </div>
  );
}

export default function SettingsModal({ open, settings, onChange, onClose }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-header">
            <Dialog.Title className="dialog-title">설정</Dialog.Title>
            <Dialog.Close className="dialog-close">✕</Dialog.Close>
          </div>
          <div className="dialog-body">
            <SettingRow
              label="역할 모스트"
              desc="포지션별 모스트 영웅 입력 활성화"
              checked={settings.useMost}
              onCheckedChange={v => onChange({ useMost: v })}
            />
            <SettingRow
              label="역할 밴"
              desc="너무 잘해서 제외할 역할 선택 활성화"
              checked={settings.useBan}
              onCheckedChange={v => onChange({ useBan: v })}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
