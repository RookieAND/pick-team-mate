import { cn } from '../cn';
import Text from '../Text';

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

export default Header;
