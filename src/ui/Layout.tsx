import type { ReactNode } from 'react';
import Text from './Text';

interface PageHeaderProps {
  title: string;
  desc?: string;
  className?: string;
  titleClassName?: string;
  descClassName?: string;
}

export function PageHeader({ title, desc, className = '', titleClassName = '', descClassName = '' }: PageHeaderProps) {
  return (
    <div className={`text-center${className ? ` ${className}` : ''}`}>
      <Text as="h2" variant="section-title" className={titleClassName}>{title}</Text>
      {desc && <Text variant="section-desc" className={`mt-1${descClassName ? ` ${descClassName}` : ''}`}>{desc}</Text>}
    </div>
  );
}

interface PageFooterProps {
  children: ReactNode;
  col?: boolean;
  className?: string;
}

export function PageFooter({ children, col = false, className = '' }: PageFooterProps) {
  const base = 'sticky bottom-0 z-10 w-full bg-base/95 backdrop-blur-sm border-t border-line/20 px-6 py-4 flex gap-2';
  const classes = [base, col ? 'flex-col' : '', className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}
