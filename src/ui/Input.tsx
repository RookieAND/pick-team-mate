import type { InputHTMLAttributes } from 'react';

const INPUT_CLASSES =
  'w-full bg-base border border-line-subtle rounded-lg px-3 py-[9px] text-text text-[0.95rem] font-[inherit] transition-colors outline-none focus:border-purple focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className = '', ...rest }: InputProps) {
  return <input className={[INPUT_CLASSES, className].filter(Boolean).join(' ')} {...rest} />;
}
