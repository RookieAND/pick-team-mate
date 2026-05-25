import type { ReactNode } from 'react';
import { cn } from '../cn';
import Text from '../Text';

interface HeaderProps {
  title: string;
  desc?: string;
  className?: string;
  titleClassName?: string;
  descClassName?: string;
  action?: ReactNode;
}

function Header({ title, desc, className, titleClassName, descClassName, action }: HeaderProps) {
  return (
    <div className={cn('relative text-center', className)}>
      <Text as="h2" variant="section-title" className={titleClassName}>{title}</Text>
      {desc && (
        <Text variant="section-desc" className={cn('mt-1', descClassName)}>{desc}</Text>
      )}
      {action && (
        <div className="absolute right-0 top-0">{action}</div>
      )}
    </div>
  );
}
Header.displayName = 'Layout.Header';

export default Header;
