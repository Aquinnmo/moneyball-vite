import type { Batter, Pitcher } from '../types';
import { formatNumber, formatPercent, getNumber } from './format';
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

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function getBatterPlateAppearances(batter: Batter): number | null {
  const plateAppearances = batter.batting?.plateAppearances ?? batter.nPA;
  return isFiniteNumber(plateAppearances) && plateAppearances > 0 ? plateAppearances : null;
}

function getBatterXrcPerPa(batter: Batter): number | null {
  const xrcPerPa = batter.expected?.xRunsCreatedPerPA;

  if (isFiniteNumber(xrcPerPa)) {
    return xrcPerPa;
  }

  const xrc = batter.expected?.xRunsCreated;
  const plateAppearances = getBatterPlateAppearances(batter);

  if (!isFiniteNumber(xrc) || plateAppearances == null) {
    return null;
  }

  return xrc / plateAppearances;
}

function getPitcherOuts(pitcher: Pitcher): number | null {
  const outs = pitcher.pitching?.outs ?? pitcher.outs;
  return isFiniteNumber(outs) && outs > 0 ? outs : null;
}

function getPitcherRunsAgainst(pitcher: Pitcher): number | null {
  return isFiniteNumber(pitcher.runsAgainst) ? pitcher.runsAgainst : null;
}

function getPitcherExpectedRunsAgainst(pitcher: Pitcher): number | null {
  const expectedRunsAgainst = pitcher.expected?.expectedRunsAllowed ?? pitcher.expRunsAgainst;
  return isFiniteNumber(expectedRunsAgainst) ? expectedRunsAgainst : null;
}

function getPitcherXwobaAllowed(pitcher: Pitcher): number | null {
  const xwobaAllowed = pitcher.expected?.xWOBAAllowed ?? pitcher.wOBA;
  return isFiniteNumber(xwobaAllowed) ? xwobaAllowed : null;
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
  const xrcPerPaBatters = activeBatters.filter((batter) => getBatterXrcPerPa(batter) != null);
  const mostEfficientBatter = topBy(xrcPerPaBatters, (batter) => getNumber(getBatterXrcPerPa(batter)));
  const batSpeedBatters = activeBatters.filter((batter) => isFiniteNumber(batter.avgBatSpeed));
  const fastestSwing = topBy(batSpeedBatters, (batter) => getNumber(batter.avgBatSpeed));
  const mostDeservedProduction = topBy(activeBatters, (batter) => getNumber(batter.expected?.xRunsCreated));
  const approachBatters = activeBatters.filter((batter) => isFiniteNumber(batter.plateDiscipline?.cswRate));
  const bestApproach = [...approachBatters]
    .sort((a, b) => getNumber(b.plateDiscipline?.swings) - getNumber(a.plateDiscipline?.swings))
    .sort((a, b) => getNumber(getBatterPlateAppearances(b)) - getNumber(getBatterPlateAppearances(a)))
    .sort((a, b) => getNumber(a.plateDiscipline?.cswRate) - getNumber(b.plateDiscipline?.cswRate))[0];

  const stories: PlayerStory[] = [
    mostDeservedProduction && {
      role: 'Star Batter',
      name: playerName(mostDeservedProduction),
      team: teamSide(mostDeservedProduction.onHomeTeam),
      metric: formatNumber(mostDeservedProduction.expected?.xRunsCreated, 2),
      tag: 'xRuns created',
    },
    mostEfficientBatter && {
      role: 'Most Efficient Batter',
      name: playerName(mostEfficientBatter),
      team: teamSide(mostEfficientBatter.onHomeTeam),
      metric: formatNumber(getBatterXrcPerPa(mostEfficientBatter), 3),
      tag: 'xRC / PA',
    },
    fastestSwing && {
      role: 'Swinging for the fences',
      name: playerName(fastestSwing),
      team: teamSide(fastestSwing.onHomeTeam),
      metric: `${formatNumber(fastestSwing.avgBatSpeed, 1)} mph`,
      tag: 'avg bat speed',
    },
    bestApproach && {
      role: 'Most Disciplined',
      name: playerName(bestApproach),
      team: teamSide(bestApproach.onHomeTeam),
      metric: formatPercent(bestApproach.plateDiscipline?.cswRate),
      tag: 'Called Strike plus Whiff rate',
    },
  ].filter((story): story is PlayerStory => Boolean(story));

  return (
    <section className="player-detail-panel hologram-bracket" aria-labelledby="batter-detail-title">
      <h3 id="batter-detail-title">Hitter Standouts</h3>
      <StoryCards stories={stories} />
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
  const inningEaterPitchers = activePitchers.filter((pitcher) => getPitcherOuts(pitcher) != null);
  const inningEater = [...inningEaterPitchers]
    .sort((a, b) => getNumber(getPitcherExpectedRunsAgainst(a)) - getNumber(getPitcherExpectedRunsAgainst(b)))
    .sort((a, b) => getNumber(getPitcherRunsAgainst(a)) - getNumber(getPitcherRunsAgainst(b)))
    .sort((a, b) => getNumber(getPitcherOuts(b)) - getNumber(getPitcherOuts(a)))[0];
  const cleanestExpectedLine = lowestBy(activePitchers, (pitcher) => getNumber(getPitcherExpectedRunsAgainst(pitcher)));
  const commandArm = topBy(activePitchers, (pitcher) => getNumber(pitcher.plateDiscipline?.cswRate));
  const contactManagerPitchers = activePitchers.filter((pitcher) => getPitcherXwobaAllowed(pitcher) != null);
  const contactManager = lowestBy(contactManagerPitchers, (pitcher) => getNumber(getPitcherXwobaAllowed(pitcher)));

  const stories: PlayerStory[] = [
    cleanestExpectedLine && {
      role: 'Cleanest line',
      name: playerName(cleanestExpectedLine),
      team: teamSide(cleanestExpectedLine.onHomeTeam),
      metric: formatNumber(cleanestExpectedLine.expected?.expectedRunsAllowed ?? cleanestExpectedLine.expRunsAgainst, 2),
      tag: 'expected runs allowed',
    },
    contactManager && {
      role: 'Contact manager',
      name: playerName(contactManager),
      team: teamSide(contactManager.onHomeTeam),
      metric: formatNumber(getPitcherXwobaAllowed(contactManager), 3),
      tag: 'xWOBA allowed',
    },
    commandArm && {
      role: 'Strikeout Artist',
      name: playerName(commandArm),
      team: teamSide(commandArm.onHomeTeam),
      metric: formatPercent(commandArm.plateDiscipline?.cswRate),
      tag: 'CSW rate',
    },
    inningEater && {
      role: 'Inning eater',
      name: playerName(inningEater),
      team: teamSide(inningEater.onHomeTeam),
      metric: formatNumber(getPitcherOuts(inningEater), 0),
      tag: 'outs recorded',
    },
  ].filter((story): story is PlayerStory => Boolean(story));

  return (
    <section className="player-detail-panel hologram-bracket" aria-labelledby="pitcher-detail-title">
      <h3 id="pitcher-detail-title">Pitcher Standouts</h3>
      <StoryCards stories={stories} />
    </section>
  );
}
