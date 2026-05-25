import { type ReactNode } from 'react';
import { cn } from '../cn';

interface FooterProps {
  col?: boolean;
  className?: string;
  children: ReactNode;
}

function Footer({ col = false, className, children }: FooterProps) {
  return (
    <div className={cn(
      'sticky bottom-0 z-10 w-full',
      'bg-base/95 backdrop-blur-sm border-t border-line/20',
      'px-6 py-4 flex gap-2',
      col && 'flex-col',
      className,
    )}>
      {children}
    </div>
  );
}
Footer.displayName = 'Layout.Footer';

export default Footer;
