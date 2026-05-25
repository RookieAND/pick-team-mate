import type { HTMLAttributes } from 'react';

type Variant = 'default' | 'dark';

const VARIANT_CLASSES: Record<Variant, string> = {
  default: 'bg-surface border border-line rounded-[14px]',
  dark:    'bg-base border border-line rounded-[10px]',
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  className?: string;
}

export default function Card({ variant = 'default', className = '', children, ...rest }: CardProps) {
  const classes = [VARIANT_CLASSES[variant], className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
