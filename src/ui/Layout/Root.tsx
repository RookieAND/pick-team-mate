import { forwardRef, type ReactNode, type CSSProperties } from 'react';
import { cn } from '../cn';

interface RootProps {
  maxWidth?: string;
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

export default Root;
