import * as Dialog from '@radix-ui/react-dialog';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store';
import PresetPanel from '../PresetPanel';

export default function PresetDialog() {
  const { showPreset, players, setPlayers, setShowPreset } = useAppStore(
    useShallow((s) => ({
      showPreset: s.showPreset,
      players: s.players,
      setPlayers: s.setPlayers,
      setShowPreset: s.setShowPreset,
    }))
  );

  return (
    <Dialog.Root open={showPreset} onOpenChange={(v) => !v && setShowPreset(false)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in-0 duration-150" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border border-line-strong rounded-2xl w-[calc(100%-40px)] max-w-[440px] z-[101] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <Dialog.Title className="text-[1rem] font-bold text-lilac m-0">
              프리셋 관리
            </Dialog.Title>
            <Dialog.Close className="bg-transparent text-dim text-[0.9rem] cursor-pointer px-2 py-1 rounded-md transition-colors hover:text-sub hover:bg-white/5 font-[inherit] leading-none">
              ✕
            </Dialog.Close>
          </div>
          <div className="p-5">
            <PresetPanel
              players={players}
              onLoad={(p) => {
                setPlayers(p);
                setShowPreset(false);
              }}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
