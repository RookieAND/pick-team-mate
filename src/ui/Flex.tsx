import { cn } from './cn';
import type { ElementType, HTMLAttributes } from 'react';

type Items = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around';

const ITEMS_CLASSES: Record<Items, string> = {
  start:    'items-start',
  center:   'items-center',
  end:      'items-end',
  stretch:  'items-stretch',
  baseline: 'items-baseline',
};

const JUSTIFY_CLASSES: Record<Justify, string> = {
  start:   'justify-start',
  center:  'justify-center',
  end:     'justify-end',
  between: 'justify-between',
  around:  'justify-around',
};

interface FlexProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  col?: boolean;
  items?: Items;
  justify?: Justify;
  gap?: number;
  wrap?: boolean;
  className?: string;
}

export default function Flex({
  as: Tag = 'div',
  col,
  items,
  justify,
  gap,
  wrap,
  className,
  children,
  ...rest
}: FlexProps) {
  return (
    <Tag
      className={cn(
        'flex',
        col && 'flex-col',
        items && ITEMS_CLASSES[items],
        justify && JUSTIFY_CLASSES[justify],
        gap != null && `gap-${gap}`,
        wrap && 'flex-wrap',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
