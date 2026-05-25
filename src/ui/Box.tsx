import type { ElementType, HTMLAttributes } from 'react';

interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  className?: string;
}

export default function Box({ as: Tag = 'div', className = '', children, ...rest }: BoxProps) {
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  );
}
