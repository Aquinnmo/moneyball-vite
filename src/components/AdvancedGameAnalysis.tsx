import type { GameData, LeaderEntry } from '../types';
import { formatNumber, formatPercent, formatSigned, getNumber } from './format';
import './AdvancedGameAnalysis.css';

export interface AdvancedGameAnalysisProps {
  /** The processed game payload returned by the API. */
  game: GameData | null | undefined;
}

interface StoryShare {
  key: string;
  title: string;
  statLabel: string;
  away: number | null | undefined;
  home: number | null | undefined;
}

interface LeaderGroup {
  key: string;
  title: string;
  entries: LeaderEntry[];
}

function getTeamLabel(game: GameData, side: 'away' | 'home'): string {
  const team = game.teams[side];
  return team?.abbreviation || team?.name || side.toUpperCase();
}

function leaderLabel(away: number | null | undefined, home: number | null | undefined, awayName: string, homeName: string): string {
  const awayValue = getNumber(away);
  const homeValue = getNumber(home);

  if (awayValue === homeValue) {
    return 'Even';
  }

  return awayValue > homeValue ? awayName : homeName;
}

function leaderValue(away: number | null | undefined, home: number | null | undefined): number | null | undefined {
  return getNumber(away) >= getNumber(home) ? away : home;
}

function getWidth(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(value * 100, 4) : 4;
}

/**
 * AdvancedGameAnalysis Component
 *
 * Shows the game model evidence as share meters and top-three stat leaderboards.
 *
 * @param props.game - The processed game data for one MLB game.
 */
export function AdvancedGameAnalysis({ game }: AdvancedGameAnalysisProps) {
  const summary = game?.summary;

  if (!game || !summary) {
    return null;
  }

  const awayName = getTeamLabel(game, 'away');
  const homeName = getTeamLabel(game, 'home');
  const shares = summary.shares;
  const differentials = summary.differentials;
  const leaders = summary.leaders;

  const storyShares: StoryShare[] = [
    {
      key: 'expected-runs',
      title: 'Expected chances',
      statLabel: 'expected run share',
      away: shares?.expectedRuns?.away,
      home: shares?.expectedRuns?.home,
    },
    {
      key: 'quality-adjusted-runs',
      title: 'Quality edge',
      statLabel: 'QA run share',
      away: shares?.qualityAdjustedRuns?.away,
      home: shares?.qualityAdjustedRuns?.home,
    },
    {
      key: 'hard-hit-balls',
      title: 'Contact edge',
      statLabel: 'hard-hit share',
      away: shares?.hardHitBalls?.away,
      home: shares?.hardHitBalls?.home,
    },
    {
      key: 'total-bases',
      title: 'Damage',
      statLabel: 'total-base share',
      away: shares?.totalBases?.away,
      home: shares?.totalBases?.home,
    },
    {
      key: 'win-probability',
      title: 'Expected result',
      statLabel: 'xWin share',
      away: shares?.winProbability?.away,
      home: shares?.winProbability?.home,
    },
  ].filter((row) => row.away != null || row.home != null);

  const leaderGroups: LeaderGroup[] = [
    {
      key: 'wops',
      title: 'Offense value',
      entries: leaders?.topBattersByWOps ?? [],
    },
    {
      key: 'hard-hit',
      title: 'Loud contact',
      entries: leaders?.topBattersByHardHitRate ?? [],
    },
    {
      key: 'whiff',
      title: 'Missed bats',
      entries: leaders?.topPitchersByWhiffRate ?? [],
    },
    {
      key: 'xra',
      title: 'Run prevention',
      entries: leaders?.topPitchersByExpectedRunsAllowed ?? [],
    },
  ].filter((group) => group.entries.length > 0);

  if (storyShares.length === 0 && leaderGroups.length === 0) {
    return null;
  }

  return (
    <section className="advanced-analysis" aria-labelledby="advanced-analysis-title">
      <div className="analysis-heading">
        <span>Evidence</span>
        <h2 className="section-title" id="advanced-analysis-title">Why the model sees it this way</h2>
      </div>

      {storyShares.length > 0 && (
        <div className="control-grid">
          {storyShares.map((row) => (
            <article className="control-row hologram-bracket" key={row.key}>
              <div className="control-row-header">
                <span>{row.title}</span>
                <strong>{leaderLabel(row.away, row.home, awayName, homeName)}</strong>
              </div>
              <strong className="control-stat">{formatPercent(leaderValue(row.away, row.home))} {row.statLabel}</strong>
              <div className="split-meter" aria-label={`${row.title}: ${awayName} ${formatPercent(row.away)}, ${homeName} ${formatPercent(row.home)}`}>
                <div className="split-meter-away" style={{ width: `${getWidth(row.away)}%` }}>
                  <span>{formatPercent(row.away)}</span>
                </div>
                <div className="split-meter-home" style={{ width: `${getWidth(row.home)}%` }}>
                  <span>{formatPercent(row.home)}</span>
                </div>
              </div>
              <div className="control-labels">
                <span>{awayName}</span>
                <span>{homeName}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {leaderGroups.length > 0 && (
        <div className="analysis-layout">
          {leaderGroups.map((group) => (
            <article className="analysis-panel hologram-bracket" key={group.key}>
              <h3>{group.title}</h3>
              <ol className="leader-story-list">
                {group.entries.slice(0, 3).map((entry) => (
                  <li key={`${group.key}-${entry.id}`}>
                    <span>{entry.fullName}</span>
                    <strong>{entry.teamSide === 'home' ? homeName : awayName}</strong>
                    <small>{formatNumber(entry.value, 3)} {entry.label}</small>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      )}

      {differentials && (
        <details className="story-details hologram-bracket">
          <summary>Show the run differential evidence</summary>
          <div className="differential-grid">
            <article className="differential-card">
              <span>Actual Run Differential</span>
              <div><strong>{formatSigned(differentials.awayRunDifferential)}</strong><strong>{formatSigned(differentials.homeRunDifferential)}</strong></div>
              <small>{awayName} / {homeName}</small>
            </article>
            <article className="differential-card">
              <span>Expected Run Differential</span>
              <div><strong>{formatSigned(differentials.awayExpectedRunDifferential)}</strong><strong>{formatSigned(differentials.homeExpectedRunDifferential)}</strong></div>
              <small>{awayName} / {homeName}</small>
            </article>
            <article className="differential-card">
              <span>Quality Adj Run Differential</span>
              <div><strong>{formatSigned(differentials.awayQualityAdjustedRunDifferential)}</strong><strong>{formatSigned(differentials.homeQualityAdjustedRunDifferential)}</strong></div>
              <small>{awayName} / {homeName}</small>
            </article>
            <article className="differential-card">
              <span>Runs Above Expected</span>
              <div><strong>{formatSigned(differentials.awayRunsAboveExpected)}</strong><strong>{formatSigned(differentials.homeRunsAboveExpected)}</strong></div>
              <small>{awayName} / {homeName}</small>
            </article>
          </div>
        </details>
      )}
    </section>
  );
}
