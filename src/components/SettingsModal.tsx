import { useEffect } from 'react';
import type { AppSettings } from '../types';
import './SettingsModal.css';

interface Props {
  settings: AppSettings;
  onChange: (s: Partial<AppSettings>) => void;
  onClose: () => void;
}

function Toggle({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button className={`toggle-item ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
      <div className="toggle-text">
        <span className="toggle-label">{label}</span>
        <span className="toggle-desc">{desc}</span>
      </div>
      <div className={`toggle-switch ${value ? 'on' : ''}`}>
        <div className="toggle-thumb" />
      </div>
    </button>
  );
}

export default function SettingsModal({ settings, onChange, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">설정</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <Toggle
            label="역할 모스트"
            desc="포지션별 모스트 영웅 입력 활성화"
            value={settings.useMost}
            onChange={v => onChange({ useMost: v })}
          />
          <Toggle
            label="역할 밴"
            desc="너무 잘해서 제외할 역할 선택 활성화"
            value={settings.useBan}
            onChange={v => onChange({ useBan: v })}
          />
        </div>
      </div>
    </div>
  );
}
