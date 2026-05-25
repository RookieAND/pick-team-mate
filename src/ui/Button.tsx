import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn';
import type { ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold rounded-full cursor-pointer transition-all whitespace-nowrap font-[inherit]',
  {
    variants: {
      variant: {
        primary: [
          'text-white bg-gradient-to-br from-purple to-violet border-none',
          'hover:opacity-90 hover:-translate-y-px active:translate-y-0',
          'disabled:from-purple-dark disabled:to-violet-dark disabled:text-[#aaa]',
          'disabled:cursor-not-allowed disabled:hover:opacity-100 disabled:hover:translate-y-0',
        ],
        secondary: 'bg-transparent border border-border-muted text-muted hover:text-sub hover:border-faint',
        ghost:     'bg-transparent border border-line text-sub hover:border-faint disabled:opacity-50 disabled:cursor-not-allowed',
        icon:      'bg-surface border border-icon-border text-lavender hover:border-purple hover:bg-icon-hover',
      },
      size: {
        xs:    'py-[7px] px-4 text-[0.8rem]',
        sm:    'py-2.5 px-7 text-[0.95rem]',
        md:    'py-3 px-6 text-[0.95rem]',
        lg:    'py-[14px] px-10',
        xl:    'py-[17px] px-10 text-[1.05rem]',
        '2xl': 'py-4 px-16 text-[1.1rem]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export default function Button({ variant, size, className, children, ...rest }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...rest}>
      {children}
    </button>
  );
}
