import { twMerge, twJoin } from 'tailwind-merge';
import { cx } from 'class-variance-authority';

// Use for merging className props with component defaults (resolves Tailwind conflicts)
export const cn = (...inputs: Parameters<typeof cx>): string => twMerge(cx(...inputs));

// Re-export twJoin for grouping class names within a component (no conflict resolution needed)
export { twJoin };
