import * as RadixSwitch from '@radix-ui/react-switch';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <RadixSwitch.Root
      className="w-10 h-[22px] rounded-full border-none p-0 cursor-pointer relative transition-colors shrink-0 data-[state=checked]:bg-purple bg-line"
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <RadixSwitch.Thumb className="block w-4 h-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-[21px] translate-x-[3px] will-change-transform" />
    </RadixSwitch.Root>
  );
}
