import { useState, useCallback, useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { shuffle, sample } from 'es-toolkit';
import type { Player } from '../../types';
import { useAppStore } from '../../store';
import { Badge, Card, Button, Layout } from '../../ui';

type TeamPair = { teamA: Player[]; teamB: Player[] };

export default function TeamSplit() {
  const { players, settings, confirmTeams, setStep } = useAppStore(
    useShallow((s) => ({
      players: s.players,
      settings: s.settings,
      confirmTeams: s.confirmTeams,
      setStep: s.setStep,
    }))
  );

  const half = Math.floor(players.length / 2);
  const split = useCallback((): TeamPair => {
    const shuffled = shuffle(players);
    return { teamA: shuffled.slice(0, half), teamB: shuffled.slice(half) };
  }, [players, half]);

  // Pre-compute initial teams once at first render
  const initRef = useRef<TeamPair | null>(null);
  if (initRef.current === null) initRef.current = split();

  const [teams, setTeams] = useState<TeamPair>(initRef.current);
  const [revealed, setRevealed] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [displayNames, setDisplayNames] = useState<{ a: string[]; b: string[] } | null>(null);
  const [tickKey, setTickKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalRef = useRef<TeamPair | null>(null);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const settle = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (finalRef.current) setTeams(finalRef.current);
    finalRef.current = null;
    setDisplayNames(null);
    setSpinning(false);
  }, []);

  const animate = useCallback(
    (target: TeamPair) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      finalRef.current = target;
      setSpinning(true);

      const names = players.map((p) => p.name || '???');
      const start = Date.now();

      (function tick() {
        const progress = Math.min((Date.now() - start) / 800, 1);
        setDisplayNames({
          a: target.teamA.map(() => sample(names)),
          b: target.teamB.map(() => sample(names)),
        });
        setTickKey((k) => k + 1);
        if (progress < 1) {
          timeoutRef.current = setTimeout(tick, 40 + Math.floor(progress * progress * 160));
        } else {
          settle();
        }
      })();
    },
    [players, settle]
  );

  const handleReveal = () => {
    setRevealed(true);
    animate(initRef.current!);
  };

  const reshuffle = () => {
    if (spinning) { settle(); return; }
    animate(split());
  };

  if (!revealed) {
    return (
      <Layout.Root maxWidth="768px">
        <Layout.Body center className="justify-center">
          <Layout.Header
            title="팀 배정"
            desc={`랜덤으로 ${half}:${players.length - half} 팀이 나뉩니다.`}
            titleClassName="page-title"
            descClassName="page-desc"
          />
          <Button
            size="2xl"
            className="px-12 page-card"
            style={{ '--card-delay': '0.35s' } as CSSProperties}
            onClick={handleReveal}
          >
            결과 보기
          </Button>
        </Layout.Body>
      </Layout.Root>
    );
  }

  return (
    <Layout.Root maxWidth="768px">
      <Layout.Body center>
        <Layout.Header
          title="팀 배정"
          desc={`랜덤으로 ${half}:${players.length - half} 팀이 나뉘었습니다.`}
          titleClassName="page-title"
          descClassName="page-desc"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {(['A', 'B'] as const).map((label, idx) => {
            const team = idx === 0 ? teams.teamA : teams.teamB;
            return (
              <Card
                key={label}
                className={`page-card overflow-hidden transition-all duration-300 ${
                  label === 'A' ? 'border-t-2 border-t-purple!' : 'border-t-2 border-t-violet!'
                } ${spinning ? 'shadow-[0_0_24px_rgba(124,58,237,0.2)] border-purple/40!' : ''}`}
                style={{ '--card-delay': `${0.32 + idx * 0.12}s` } as CSSProperties}
              >
                <div className="px-4 py-3 font-bold text-[0.95rem] text-lilac bg-card-header border-b border-line">
                  팀 {label}
                </div>
                <ul className="flex flex-col">
                  {team.map((p: Player, i: number) => {
                    const cyclingName =
                      spinning && displayNames
                        ? (idx === 0 ? displayNames.a[i] : displayNames.b[i])
                        : null;
                    return (
                      <li
                        key={p.id}
                        className="flex items-center gap-2 px-4 py-2.5 border-b border-line/60 last:border-0"
                      >
                        <span
                          key={cyclingName ? `${tickKey}-${idx}-${i}` : p.id}
                          className={`flex-1 font-semibold text-[0.9rem] truncate ${cyclingName ? 'text-lilac slot-in' : ''}`}
                        >
                          {cyclingName ?? (p.name || '(이름 없음)')}
                        </span>
                        {!spinning && settings.useMost && (
                          <div className="flex gap-1 shrink-0">
                            <Badge role="tank">{p.most.tank[0]}</Badge>
                            <Badge role="dps">{p.most.dps[0]}</Badge>
                            <Badge role="heal">{p.most.heal[0]}</Badge>
                          </div>
                        )}
                        {!spinning && settings.useBan && p.banned.length > 0 && (
                          <div className="flex gap-1 shrink-0">
                            {p.banned.map((role) => (
                              <Badge
                                key={role}
                                role={role}
                                size="sm"
                                className="opacity-60 line-through"
                              >
                                {role === 'tank' ? '탱' : role === 'dps' ? '딜' : '힐'}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            );
          })}
        </div>
      </Layout.Body>

      <Layout.Footer className="page-actions">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={() => setStep('input')}
          disabled={spinning}
        >
          이전
        </Button>
        <Button variant="ghost" size="lg" className="flex-1" onClick={reshuffle}>
          {spinning ? '즉시 보기' : '다시 섞기'}
        </Button>
        <Button
          size="lg"
          className="flex-[2]"
          onClick={() => confirmTeams(teams.teamA, teams.teamB)}
          disabled={spinning}
        >
          역할 배정
        </Button>
      </Layout.Footer>
    </Layout.Root>
  );
}
