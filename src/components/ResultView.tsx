import type { AssignedPlayer, Role, AppSettings } from '../types';
import './ResultView.css';

interface Props {
  teamA: AssignedPlayer[];
  teamB: AssignedPlayer[];
  settings: AppSettings;
  onReset: () => void;
}

const ROLE_LABELS: Record<Role, string> = { tank: '탱커', dps: '딜러', heal: '힐러' };
const ROLE_ORDER: Role[] = ['tank', 'heal', 'dps'];

function sortByRole(players: AssignedPlayer[]) {
  return [...players].sort(
    (a, b) => ROLE_ORDER.indexOf(a.assignedRole) - ROLE_ORDER.indexOf(b.assignedRole)
  );
}

function TeamResult({ players, label, showMost }: { players: AssignedPlayer[]; label: string; showMost: boolean }) {
  const sorted = sortByRole(players);
  return (
    <div className="team-result">
      <div className="result-team-header">팀 {label}</div>
      <div className="result-players">
        {sorted.map(p => (
          <div key={p.id} className={`result-player role-bg-${p.assignedRole}`}>
            <span className={`result-role role-${p.assignedRole}`}>
              {ROLE_LABELS[p.assignedRole]}
            </span>
            <span className="result-name">{p.name}</span>
            {showMost && (
              <span className="result-mosts">
                {p.most[p.assignedRole].map((hero, i) => (
                  <span key={i} className={`mini-badge role-${p.assignedRole}`}>{hero}</span>
                ))}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultView({ teamA, teamB, settings, onReset }: Props) {
  return (
    <div className="result-view">
      <h2 className="section-title">배정 완료!</h2>
      <p className="section-desc">모든 팀원의 역할이 배정되었습니다.</p>
      <div className="result-teams">
        <TeamResult players={teamA} label="A" showMost={settings.useMost} />
        <TeamResult players={teamB} label="B" showMost={settings.useMost} />
      </div>
      <button className="reset-btn" onClick={onReset}>
        처음부터 다시 →
      </button>
    </div>
  );
}
