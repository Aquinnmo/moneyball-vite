import type { Batter, Pitcher } from '../types';
import { formatInteger, formatNumber, formatPercent, formatSigned, getNumber } from './format';
import './PlayerDetailTables.css';

export interface BatterDetailTableProps {
  /** The batter rows returned by the processed game API. */
  batters: Batter[] | undefined;
}

export interface PitcherDetailTableProps {
  /** The pitcher rows returned by the processed game API. */
  pitchers: Pitcher[] | undefined;
}

interface PlayerStory {
  role: string;
  name: string;
  team: string;
  metric: string;
  tag: string;
}

function playerName(player: Batter | Pitcher): string {
  return player.fullName || `Player ${player.id}`;
}

function teamSide(onHomeTeam: boolean): string {
  return onHomeTeam ? 'Home' : 'Away';
}

function topBy<T>(players: T[], score: (player: T) => number): T | undefined {
  return [...players].sort((a, b) => score(b) - score(a))[0];
}

function lowestBy<T>(players: T[], score: (player: T) => number): T | undefined {
  return [...players].sort((a, b) => score(a) - score(b))[0];
}

function StoryCards({ stories }: { stories: PlayerStory[] }) {
  return (
    <div className="player-story-grid">
      {stories.map((story) => (
        <article className="player-story-card" key={story.role}>
          <span>{story.role}</span>
          <strong>{story.name}</strong>
          <small>{story.team}</small>
          <b>{story.metric}</b>
          <em>{story.tag}</em>
        </article>
      ))}
    </div>
  );
}

/**
 * BatterDetailTable Component
 *
 * Shows hitter stories as role, player, side, and decisive stat callouts, with
 * the raw table available only as supporting evidence.
 *
 * @param props.batters - Batter rows for one game.
 */
export function BatterDetailTable({ batters }: BatterDetailTableProps) {
  if (!batters || batters.length === 0) {
    return null;
  }

  const activeBatters = batters.filter((batter) => getNumber(batter.nPA) > 0 || getNumber(batter.batting?.plateAppearances) > 0);
  const bestBat = topBy(activeBatters, (batter) => getNumber(batter.wOPS, getNumber(batter.expected?.xOPS)));
  const loudestContact = topBy(activeBatters, (batter) => getNumber(batter.battedBall?.hardHitRate));
  const mostDeservedProduction = topBy(activeBatters, (batter) => getNumber(batter.expected?.xRunsCreated));
  const bestApproach = topBy(activeBatters, (batter) => getNumber(batter.plateDiscipline?.cswRate));

  const stories: PlayerStory[] = [
    bestBat && {
      role: 'Best bat',
      name: playerName(bestBat),
      team: teamSide(bestBat.onHomeTeam),
      metric: formatNumber(bestBat.wOPS ?? bestBat.expected?.xOPS, 3),
      tag: 'wOPS/xOPS',
    },
    loudestContact && {
      role: 'Loudest contact',
      name: playerName(loudestContact),
      team: teamSide(loudestContact.onHomeTeam),
      metric: formatPercent(loudestContact.battedBall?.hardHitRate),
      tag: 'hard-hit rate',
    },
    mostDeservedProduction && {
      role: 'Run creation',
      name: playerName(mostDeservedProduction),
      team: teamSide(mostDeservedProduction.onHomeTeam),
      metric: formatNumber(mostDeservedProduction.expected?.xRunsCreated, 2),
      tag: 'xRuns created',
    },
    bestApproach && {
      role: 'Approach',
      name: playerName(bestApproach),
      team: teamSide(bestApproach.onHomeTeam),
      metric: formatPercent(bestApproach.plateDiscipline?.cswRate),
      tag: 'CSW rate',
    },
  ].filter((story): story is PlayerStory => Boolean(story));

  const sortedBatters = [...activeBatters].sort((a, b) => getNumber(b.wOPS, getNumber(b.expected?.xOPS)) - getNumber(a.wOPS, getNumber(a.expected?.xOPS)));

  return (
    <section className="player-detail-panel hologram-bracket" aria-labelledby="batter-detail-title">
      <h3 id="batter-detail-title">Hitters who explain the game</h3>
      <StoryCards stories={stories} />
      <details className="player-evidence-details">
        <summary>Show hitter evidence table</summary>
        <div className="player-detail-table-wrap">
          <table className="player-detail-table">
            <thead>
              <tr>
                <th>Batter</th>
                <th>Side</th>
                <th>PA</th>
                <th>OPS</th>
                <th>xOPS</th>
                <th>xRC</th>
                <th>Hard Hit%</th>
                <th>Whiff%</th>
              </tr>
            </thead>
            <tbody>
              {sortedBatters.map((batter) => (
                <tr key={batter.id}>
                  <td>{playerName(batter)}</td>
                  <td>{teamSide(batter.onHomeTeam)}</td>
                  <td>{formatInteger(batter.batting?.plateAppearances ?? batter.nPA)}</td>
                  <td>{formatNumber(batter.batting?.ops ?? batter.wOPS, 3)}</td>
                  <td>{formatNumber(batter.expected?.xOPS ?? batter.wOPS, 3)}</td>
                  <td>{formatNumber(batter.expected?.xRunsCreated, 2)}</td>
                  <td>{formatPercent(batter.battedBall?.hardHitRate)}</td>
                  <td>{formatPercent(batter.plateDiscipline?.whiffRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

/**
 * PitcherDetailTable Component
 *
 * Shows pitching stories as role, player, side, and decisive stat callouts,
 * with the raw table available only as supporting evidence.
 *
 * @param props.pitchers - Pitcher rows for one game.
 */
export function PitcherDetailTable({ pitchers }: PitcherDetailTableProps) {
  if (!pitchers || pitchers.length === 0) {
    return null;
  }

  const activePitchers = pitchers.filter((pitcher) => getNumber(pitcher.battersFaced) > 0 || getNumber(pitcher.pitching?.battersFaced) > 0);
  const bestPrevention = topBy(activePitchers, (pitcher) => getNumber(pitcher.expected?.runPreventionValue));
  const cleanestExpectedLine = lowestBy(activePitchers, (pitcher) => getNumber(pitcher.expected?.expectedRunsAllowed, getNumber(pitcher.expRunsAgainst)));
  const commandArm = topBy(activePitchers, (pitcher) => getNumber(pitcher.plateDiscipline?.cswRate));
  const contactManager = lowestBy(activePitchers, (pitcher) => getNumber(pitcher.contactAllowed?.hardHitRate, 1));

  const stories: PlayerStory[] = [
    bestPrevention && {
      role: 'Run prevention',
      name: playerName(bestPrevention),
      team: teamSide(bestPrevention.onHomeTeam),
      metric: formatSigned(bestPrevention.expected?.runPreventionValue, 2),
      tag: 'run prevention value',
    },
    cleanestExpectedLine && {
      role: 'Cleanest line',
      name: playerName(cleanestExpectedLine),
      team: teamSide(cleanestExpectedLine.onHomeTeam),
      metric: formatNumber(cleanestExpectedLine.expected?.expectedRunsAllowed ?? cleanestExpectedLine.expRunsAgainst, 2),
      tag: 'expected runs allowed',
    },
    commandArm && {
      role: 'Command',
      name: playerName(commandArm),
      team: teamSide(commandArm.onHomeTeam),
      metric: formatPercent(commandArm.plateDiscipline?.cswRate),
      tag: 'CSW rate',
    },
    contactManager && {
      role: 'Contact manager',
      name: playerName(contactManager),
      team: teamSide(contactManager.onHomeTeam),
      metric: formatPercent(contactManager.contactAllowed?.hardHitRate),
      tag: 'hard-hit allowed',
    },
  ].filter((story): story is PlayerStory => Boolean(story));

  const sortedPitchers = [...activePitchers].sort(
    (a, b) => getNumber(a.expected?.expectedRunsAllowed, getNumber(a.expRunsAgainst)) - getNumber(b.expected?.expectedRunsAllowed, getNumber(b.expRunsAgainst)),
  );

  return (
    <section className="player-detail-panel hologram-bracket" aria-labelledby="pitcher-detail-title">
      <h3 id="pitcher-detail-title">Pitchers who explain the game</h3>
      <StoryCards stories={stories} />
      <details className="player-evidence-details">
        <summary>Show pitcher evidence table</summary>
        <div className="player-detail-table-wrap">
          <table className="player-detail-table">
            <thead>
              <tr>
                <th>Pitcher</th>
                <th>Side</th>
                <th>BF</th>
                <th>IP</th>
                <th>K%</th>
                <th>xRA</th>
                <th>Run Prev</th>
                <th>Hard Hit%</th>
              </tr>
            </thead>
            <tbody>
              {sortedPitchers.map((pitcher) => (
                <tr key={pitcher.id}>
                  <td>{playerName(pitcher)}</td>
                  <td>{teamSide(pitcher.onHomeTeam)}</td>
                  <td>{formatInteger(pitcher.pitching?.battersFaced ?? pitcher.battersFaced)}</td>
                  <td>{pitcher.pitching?.inningsPitched ?? '--'}</td>
                  <td>{formatPercent(pitcher.pitching?.strikeoutRate)}</td>
                  <td>{formatNumber(pitcher.expected?.expectedRunsAllowed ?? pitcher.expRunsAgainst, 2)}</td>
                  <td>{formatSigned(pitcher.expected?.runPreventionValue, 2)}</td>
                  <td>{formatPercent(pitcher.contactAllowed?.hardHitRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
