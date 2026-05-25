import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'icon';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const DEFAULT_SIZE: Record<Variant, Size> = {
  primary: 'lg',
  secondary: 'md',
  ghost: 'md',
  icon: 'md',
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'text-white bg-gradient-to-br from-purple to-violet border-none hover:opacity-90 hover:-translate-y-px active:translate-y-0 disabled:from-[#4a2a8a] disabled:to-[#6b3aaa] disabled:text-[#aaa] disabled:cursor-not-allowed disabled:hover:opacity-100 disabled:hover:translate-y-0',
  secondary:
    'bg-transparent border border-[#333] text-muted hover:text-sub hover:border-[#666]',
  ghost:
    'bg-transparent border border-line text-sub hover:border-[#555] disabled:opacity-50 disabled:cursor-not-allowed',
  icon: 'bg-surface border border-[#3a3a5a] text-lavender hover:border-purple hover:bg-[#1e1040]',
};

const SIZE_CLASSES: Record<Size, string> = {
  xs:  'py-[7px] px-4 text-[0.8rem]',
  sm:  'py-2.5 px-7 text-[0.95rem]',
  md:  'py-3 px-6 text-[0.95rem]',
  lg:  'py-[14px] px-10',
  xl:  'py-[17px] px-10 text-[1.05rem]',
  '2xl': 'py-4 px-16 text-[1.1rem]',
};

const BASE =
  'inline-flex items-center justify-center font-bold rounded-full cursor-pointer transition-all whitespace-nowrap font-[inherit]';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const resolvedSize = size ?? DEFAULT_SIZE[variant];
  const classes = [BASE, VARIANT_CLASSES[variant], SIZE_CLASSES[resolvedSize], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
