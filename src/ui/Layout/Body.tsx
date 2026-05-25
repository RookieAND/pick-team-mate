import { type ReactNode } from 'react';
import { cn } from '../cn';

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

export default Body;
