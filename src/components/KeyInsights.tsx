import { type GameData } from '../types';
import './KeyInsights.css';

export interface KeyInsightsProps {
  /** The processed game data used to derive narrative insight cards. */
  game: GameData | null | undefined;
}

interface Insight {
  id: string;
  label: string;
  value: string;
  metric: string;
}

function getNumber(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function formatNumber(value: number, digits: number): string {
  return value.toFixed(digits);
}

function formatPercent(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '--';
  }

  return `${(value * 100).toFixed(1)}%`;
}

/**
 * KeyInsights Component
 *
 * Turns the processed game metrics into a concise, readable game story. The
 * cards favor natural language while still exposing the underlying data point.
 *
 * @param props.game - The processed game payload returned by the API.
 */
export function KeyInsights({ game }: KeyInsightsProps) {
  if (!game) return null;

  const away = game.teams.away;
  const home = game.teams.home;

  if (!away || !home) {
    return null;
  }

  const awayName = away.name || away.abbreviation || 'Away';
  const homeName = home.name || home.abbreviation || 'Home';
  const awayShort = away.abbreviation || awayName;
  const homeShort = home.abbreviation || homeName;
  const awayExpectedDiff = getNumber(away.expRunsFor) - getNumber(away.expRunsAgainst);
  const homeExpectedDiff = getNumber(home.expRunsFor) - getNumber(home.expRunsAgainst);
  const awayFinishing = getNumber(away.runs) - getNumber(away.expRunsFor);
  const homeFinishing = getNumber(home.runs) - getNumber(home.expRunsFor);
  const awayContact = getNumber(away.wOBA) + getNumber(away.xSLG);
  const homeContact = getNumber(home.wOBA) + getNumber(home.xSLG);
  const insights: Insight[] = [];

  if (game.isStolenGame) {
    insights.push({
      id: 'stolen-game',
      label: 'Game Type',
      value: 'Stolen',
      metric: 'Pitching edge',
    });
  }

  if (Math.abs(awayExpectedDiff - homeExpectedDiff) >= 0.75) {
    const leader = awayExpectedDiff > homeExpectedDiff ? awayName : homeName;
    const leaderDiff = awayExpectedDiff > homeExpectedDiff ? awayExpectedDiff : homeExpectedDiff;

    insights.push({
      id: 'expected-control',
      label: 'xRun Edge',
      value: leader,
      metric: `${formatNumber(leaderDiff, 2)} xRD`,
    });
  }

  if (Math.abs(awayFinishing - homeFinishing) >= 1) {
    const leader = awayFinishing > homeFinishing ? awayName : homeName;
    const finishing = awayFinishing > homeFinishing ? awayFinishing : homeFinishing;

    insights.push({
      id: 'finishing-edge',
      label: 'Finish',
      value: leader,
      metric: `${formatNumber(finishing, 2)} R above xR`,
    });
  }

  if (Math.abs(awayContact - homeContact) >= 0.1) {
    const leader = awayContact > homeContact ? awayName : homeName;
    const contact = awayContact > homeContact ? away : home;

    insights.push({
      id: 'contact-quality',
      label: 'Contact',
      value: leader,
      metric: `${formatNumber(getNumber(contact.wOBA), 3)} wOBA`,
    });
  }

  if (away.expWin != null || home.expWin != null) {
    const leader = getNumber(away.expWin) >= getNumber(home.expWin) ? awayShort : homeShort;
    const leaderWin = getNumber(away.expWin) >= getNumber(home.expWin) ? away.expWin : home.expWin;

    insights.push({
      id: 'expected-win',
      label: 'xWin',
      value: leader,
      metric: formatPercent(leaderWin),
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'balanced-game',
      label: 'Profile',
      value: 'Balanced',
      metric: `${awayShort} ${formatNumber(getNumber(away.expRunsFor), 2)} xR | ${homeShort} ${formatNumber(getNumber(home.expRunsFor), 2)} xR`,
    });
  }

  return (
    <section className="key-insights-container" aria-labelledby="key-insights-title">
      <div className="insights-header">
        <h2 id="key-insights-title">Quick Insights</h2>
        <span>{insights.length} signals</span>
      </div>
      <div className="insights-list" id="key-insights-title">
        {insights.slice(0, 4).map((insight) => (
          <article key={insight.id} className="insight-card hologram-bracket">
            <span className="insight-label">{insight.label}</span>
            <strong>{insight.value}</strong>
            <span className="insight-metric">{insight.metric}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
