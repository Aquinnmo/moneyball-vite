import type { GameTeam } from '../types';
import { formatInteger, formatNumber, formatPercent, formatSigned, getNumber } from './format';

export interface TeamTableProps {
  /** The team data containing actual, expected, contact, discipline, and outcome stats to display. */
  team: GameTeam | null | undefined;
  /** The opposing team, used only to frame the team story. */
  opponent?: GameTeam | null | undefined;
}

interface StoryPoint {
  label: string;
  subject: string;
  metric: string;
  tag: string;
}

interface EvidenceRow {
  label: string;
  value: string;
}

function teamName(team: GameTeam): string {
  return team.abbreviation || team.name || 'Team';
}

function compactEvidence(rows: EvidenceRow[]) {
  return (
    <div className="team-evidence-grid">
      {rows.map((row) => (
        <article key={row.label}>
          <span>{row.label}</span>
          <strong>{row.value}</strong>
        </article>
      ))}
    </div>
  );
}

/**
 * TeamTable Component
 *
 * Renders a stat-led team profile with compact story cards and deeper metrics
 * available as collapsible evidence.
 *
 * @param props.team - Parsed team stats from the API.
 * @param props.opponent - Opposing team used to contextualize run prevention.
 */
export function TeamTable({ team, opponent }: TeamTableProps) {
  if (!team) {
    return null;
  }

  const name = teamName(team);
  const opponentName = opponent ? teamName(opponent) : 'their opponent';
  const actualRuns = getNumber(team.runs);
  const expectedRuns = getNumber(team.expectedOutcome?.expectedRunsFor, getNumber(team.expRunsFor));
  const qualityRuns = getNumber(team.expectedOutcome?.qualityAdjustedRunsFor, getNumber(team.expectedBatting?.qualityAdjustedRuns));
  const expectedRunsAllowed = getNumber(team.expectedOutcome?.expectedRunsAgainst, getNumber(team.expRunsAgainst));
  const actualRunsAllowed = getNumber(team.runsAgainst);
  const runPreventionGap = expectedRunsAllowed - actualRunsAllowed;
  const finishedChances = actualRuns >= expectedRuns;

  const stories: StoryPoint[] = [
    {
      label: 'Scoring',
      subject: name,
      metric: `${formatInteger(team.runs)} / ${formatNumber(expectedRuns, 2)}`,
      tag: finishedChances ? 'finished chances' : 'left chances',
    },
    {
      label: 'Offense quality',
      subject: name,
      metric: formatNumber(qualityRuns, 2),
      tag: 'quality-adjusted runs',
    },
    {
      label: 'Contact',
      subject: name,
      metric: formatPercent(team.battedBall?.hardHitRate),
      tag: `${formatPercent(team.battedBall?.barrelRate)} barrels`,
    },
    {
      label: 'Approach',
      subject: name,
      metric: formatPercent(team.plateDiscipline?.cswRate),
      tag: `${formatPercent(team.plateDiscipline?.whiffRate)} whiff`,
    },
    {
      label: 'Run prevention',
      subject: name,
      metric: `${formatInteger(team.runsAgainst)} / ${formatNumber(expectedRunsAllowed, 2)}`,
      tag: runPreventionGap >= 0 ? `${opponentName} held under xRA` : `${opponentName} beat xRA`,
    },
  ];

  const evidenceRows: EvidenceRow[] = [
    { label: 'xWin', value: formatPercent(team.expectedOutcome?.expectedWinPercentage ?? team.expWin) },
    { label: 'Expected Run Diff', value: formatSigned(team.expectedOutcome?.expectedRunDifferential, 2) },
    { label: 'QA Run Diff', value: formatSigned(team.expectedOutcome?.qualityAdjustedRunDifferential, 2) },
    { label: 'Contact Advantage', value: formatSigned(team.expectedOutcome?.contactAdvantageRuns, 2) },
    { label: 'Discipline Advantage', value: formatSigned(team.expectedOutcome?.disciplineAdvantageRuns, 2) },
    { label: 'Actual +/- Expected Runs', value: formatSigned(team.expectedOutcome?.actualRunsAboveExpected, 2) },
    { label: 'xWOBA', value: formatNumber(team.expectedBatting?.xWOBA ?? team.wOBA, 3) },
    { label: 'xOPS', value: formatNumber(team.expectedBatting?.xOPS ?? team.wOPS, 3) },
    { label: 'Total Bases', value: formatNumber(team.batting?.totalBases, 0) },
    { label: 'Pitching K%', value: formatPercent(team.pitching?.strikeoutRate) },
    { label: 'Pitching BB%', value: formatPercent(team.pitching?.walkRate) },
    { label: 'Contact Allowed Hard Hit%', value: formatPercent(team.contactAllowed?.hardHitRate) },
  ];

  return (
    <section className="team-block team-story-panel">
      <h3 className="block-title">{team.name || team.abbreviation}</h3>
      <div className="team-story-list">
        {stories.map((story) => (
          <article className="team-story-card" key={story.label}>
            <span>{story.label}</span>
            <small>{story.subject}</small>
            <strong>{story.metric}</strong>
            <em>{story.tag}</em>
          </article>
        ))}
      </div>
      <details className="team-evidence-details">
        <summary>Show supporting team metrics</summary>
        {compactEvidence(evidenceRows)}
      </details>
    </section>
  );
}
