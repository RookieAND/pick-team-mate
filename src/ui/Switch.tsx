import { twJoin } from './cn';
import * as RadixSwitch from '@radix-ui/react-switch';

const ROOT_CLS = twJoin(
  'w-10 h-[22px] rounded-full border-none p-0',
  'cursor-pointer relative transition-colors shrink-0',
  'data-[state=checked]:bg-purple bg-line',
);

const THUMB_CLS = twJoin(
  'block w-4 h-4 rounded-full bg-white shadow-sm',
  'transition-transform will-change-transform',
  'data-[state=checked]:translate-x-[21px] translate-x-[3px]',
);

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <RadixSwitch.Root className={ROOT_CLS} checked={checked} onCheckedChange={onCheckedChange}>
      <RadixSwitch.Thumb className={THUMB_CLS} />
    </RadixSwitch.Root>
  );
}
