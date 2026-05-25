import { forwardRef, type ReactNode, type CSSProperties } from 'react';
import { cn } from './cn';
import Text from './Text';

// ─── Root ─────────────────────────────────────────────────────────────
interface RootProps {
  maxWidth?: string;   // CSS value, e.g. "900px", "768px", "680px", "1100px"
  className?: string;
  children: ReactNode;
}

const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ maxWidth, className, children }, ref) => (
    <div
      ref={ref}
      style={maxWidth ? ({ maxWidth } as CSSProperties) : undefined}
      className={cn('w-full flex flex-col flex-1', className)}
    >
      {children}
    </div>
  )
);
Root.displayName = 'Layout.Root';

// ─── Header ───────────────────────────────────────────────────────────
interface HeaderProps {
  title: string;
  desc?: string;
  className?: string;
  titleClassName?: string;
  descClassName?: string;
}

function Header({ title, desc, className, titleClassName, descClassName }: HeaderProps) {
  return (
    <div className={cn('text-center', className)}>
      <Text as="h2" variant="section-title" className={titleClassName}>{title}</Text>
      {desc && (
        <Text variant="section-desc" className={cn('mt-1', descClassName)}>{desc}</Text>
      )}
    </div>
  );
}
Header.displayName = 'Layout.Header';

// ─── Body ─────────────────────────────────────────────────────────────
interface BodyProps {
  center?: boolean;
  className?: string;
  children: ReactNode;
}

function Body({ center = false, className, children }: BodyProps) {
  return (
    <div className={cn(
      'flex-1 px-6 pt-8 pb-4 flex flex-col gap-6',
      center && 'items-center',
      className,
    )}>
      {children}
    </div>
  );
}
Body.displayName = 'Layout.Body';

// ─── Footer ───────────────────────────────────────────────────────────
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

// ─── Compound export ──────────────────────────────────────────────────
export const Layout = { Root, Header, Body, Footer };
