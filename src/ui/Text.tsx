import type { ElementType, HTMLAttributes } from 'react';

type Variant =
  | 'default'
  | 'section-title'
  | 'section-desc'
  | 'sub'
  | 'muted'
  | 'dim'
  | 'faint'
  | 'lilac'
  | 'lavender';

const VARIANT_CLASSES: Record<Variant, string> = {
  'default':      'text-text',
  'section-title': 'text-[2rem] font-bold text-lavender',
  'section-desc':  'text-[0.92rem] text-muted text-center',
  'sub':           'text-sub',
  'muted':         'text-muted',
  'dim':           'text-dim',
  'faint':         'text-faint',
  'lilac':         'text-lilac',
  'lavender':      'text-lavender',
};

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: Variant;
  className?: string;
}

export default function Text({
  as: Tag = 'p',
  variant = 'default',
  className = '',
  children,
  ...rest
}: TextProps) {
  const classes = [VARIANT_CLASSES[variant], className].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
