import type { Role } from '../../types';

export default function RoleBadge({
  role,
  size = 'default',
  className = '',
  children,
}: {
  role: Role;
  size?: 'default' | 'sm';
  className?: string;
  children: React.ReactNode;
}) {
  const base = size === 'sm' ? `badge-sm-${role}` : `badge-${role}`;
  return <span className={className ? `${base} ${className}` : base}>{children}</span>;
}
