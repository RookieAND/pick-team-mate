type Role = 'tank' | 'dps' | 'heal' | 'ban';
type Size = 'default' | 'sm';

const SIZE_CLASSES: Record<Size, string> = {
  default:
    'inline-flex items-center justify-center px-2 py-0.5 rounded-xl text-[0.72rem] font-bold whitespace-nowrap',
  sm: 'inline-flex items-center justify-center px-1.5 py-px rounded-[10px] text-[0.62rem] font-bold whitespace-nowrap',
};

const ROLE_CLASSES: Record<Role, string> = {
  tank: 'bg-tank-b text-tank-t',
  dps:  'bg-dps-b text-dps-t',
  heal: 'bg-heal-b text-heal-t',
  ban:  'bg-[#2a1515] text-danger',
};

interface BadgeProps {
  role: Role;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ role, size = 'default', className = '', children }: BadgeProps) {
  const classes = [SIZE_CLASSES[size], ROLE_CLASSES[role], className].filter(Boolean).join(' ');
  return <span className={classes}>{children}</span>;
}
