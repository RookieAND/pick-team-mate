import { cn } from './cn';
import type { InputHTMLAttributes } from 'react';

const BASE = [
  'w-full bg-base border border-line-subtle rounded-lg',
  'px-3 py-[9px] text-text text-[0.95rem] font-[inherit]',
  'transition-colors outline-none',
  'focus:border-purple focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]',
].join(' ');

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...rest }: InputProps) {
  return <input className={cn(BASE, className)} {...rest} />;
}
