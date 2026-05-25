import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../store';
import { Dialog } from '../../ui';
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
    <Dialog
      open={showPreset}
      onOpenChange={(v) => !v && setShowPreset(false)}
      title="프리셋 관리"
      maxWidth="440px"
    >
      <div className="p-5">
        <PresetPanel
          players={players}
          onLoad={(p) => {
            setPlayers(p);
            setShowPreset(false);
          }}
        />
      </div>
    </Dialog>
  );
}
