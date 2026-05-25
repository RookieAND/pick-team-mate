import { Switch } from '../../ui';

interface SettingRowProps {
  label: string;
  desc: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}

export default function SettingRow({ label, desc, checked, onCheckedChange }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 bg-base border border-line rounded-xl px-3.5 py-3">
      <div className="flex flex-col gap-1">
        <span className="text-[0.88rem] font-bold text-text">{label}</span>
        <span className="text-[0.72rem] text-dim">{desc}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
