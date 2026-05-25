import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center font-bold whitespace-nowrap',
  {
    variants: {
      role: {
        tank: 'bg-tank-b text-tank-t',
        dps:  'bg-dps-b text-dps-t',
        heal: 'bg-heal-b text-heal-t',
        ban:  'bg-ban-b text-danger',
      },
      size: {
        default: 'px-2 py-0.5 rounded-xl text-[0.72rem]',
        sm:      'px-1.5 py-px rounded-[10px] text-[0.62rem]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

type BadgeProps = {
  role: 'tank' | 'dps' | 'heal' | 'ban';
  size?: 'default' | 'sm';
  className?: string;
  children: React.ReactNode;
};

export default function Badge({ role, size, className, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ role, size }), className)}>{children}</span>;
}
