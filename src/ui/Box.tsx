import { cn } from './cn';
import type { ElementType, HTMLAttributes } from 'react';

interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  className?: string;
}

export default function Box({ as: Tag = 'div', className, children, ...rest }: BoxProps) {
  return (
    <Tag className={cn(className)} {...rest}>
      {children}
    </Tag>
  );
}
