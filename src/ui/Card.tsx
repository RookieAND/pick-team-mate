import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn';
import type { HTMLAttributes } from 'react';

const cardVariants = cva('border', {
  variants: {
    variant: {
      default: 'bg-surface border-line rounded-[14px]',
      dark:    'bg-base border-line rounded-[10px]',
    },
  },
  defaultVariants: { variant: 'default' },
});

type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

export default function Card({ variant, className, children, ...rest }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...rest}>
      {children}
    </div>
  );
}
