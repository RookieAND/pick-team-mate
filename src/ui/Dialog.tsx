import * as RadixDialog from '@radix-ui/react-dialog';
import type { CSSProperties } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Dialog({
  open,
  onOpenChange,
  title,
  children,
  maxWidth = '400px',
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in-0 duration-150" />
        <RadixDialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border border-line-strong rounded-2xl w-[calc(100%-40px)] z-[101] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
          style={{ maxWidth } as CSSProperties}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <RadixDialog.Title className="text-[1rem] font-bold text-lilac m-0">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Close className="bg-transparent border-none text-dim text-[0.9rem] cursor-pointer px-2 py-1 rounded-md transition-colors hover:text-sub hover:bg-white/5 font-[inherit] leading-none">
              ✕
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
