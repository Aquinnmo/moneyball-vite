import type { Batter, GameData, GameTeam, Pitcher } from '../types';
import './AdvancedGameAnalysis.css';

export interface AdvancedGameAnalysisProps {
  /** The processed game payload returned by the API. */
  game: GameData | null | undefined;
}

interface TeamAnalysisRow {
  key: string;
  label: string;
  away: string;
  home: string;
  leader: string;
}

interface ComparisonRow {
  key: string;
  label: string;
  away: number;
  home: number;
  awayWidth: number;
  homeWidth: number;
  displayAway: string;
  displayHome: string;
}

function getNumber(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function formatNumber(value: number | null | undefined, digits: number): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '--';
  }

  return value.toFixed(digits);
}

function formatPercent(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '--';
  }

  return `${(value * 100).toFixed(1)}%`;
}

function getTeamName(team: GameTeam | null | undefined, fallback: string): string {
  return team?.abbreviation || team?.name || fallback;
}

function getExpectedHits(team: GameTeam | null | undefined): number {
  return getNumber(team?.xBA) * getNumber(team?.nPA);
}

function getRunShare(team: GameTeam | null | undefined, opponent: GameTeam | null | undefined): number {
  const teamRuns = getNumber(team?.expRunsFor);
  const totalRuns = teamRuns + getNumber(opponent?.expRunsFor);

  return totalRuns > 0 ? teamRuns / totalRuns : 0;
}

function getShare(value: number, comparison: number): number {
  const total = value + comparison;

  return total > 0 ? value / total : 0.5;
}

function getLeader(awayValue: number, homeValue: number, awayName: string, homeName: string, lowerIsBetter = false): string {
  if (awayValue === homeValue) {
    return 'Even';
  }

  const awayLeads = lowerIsBetter ? awayValue < homeValue : awayValue > homeValue;
  return awayLeads ? awayName : homeName;
}

function getBatterImpact(batter: Batter): number {
  return (
    getNumber(batter.wOBA) * 2 +
    getNumber(batter.expTimesOnBase) * 0.75 +
    getNumber(batter.avgExitVelo) / 120
  );
}

function getPowerImpact(batter: Batter): number {
  return (
    getNumber(batter.expBases) +
    getNumber(batter.xSLG) * 1.5 +
    getNumber(batter.maxExitVelo) / 120 +
    getNumber(batter.maxBatSpeed) / 90
  );
}

function getPitcherRisk(pitcher: Pitcher): number {
  const battersFaced = Math.max(getNumber(pitcher.battersFaced), 1);

  return (
    getNumber(pitcher.expRunsAgainst) / battersFaced +
    getNumber(pitcher.wOBA) +
    getNumber(pitcher.xSLG) * 0.5
  );
}

/**
 * AdvancedGameAnalysis Component
 *
 * Converts the processed game response into higher-order baseball analysis:
 * expected run control, finishing deltas, contact quality, power quality, and
 * player impact rankings. This component is purely presentational and uses only
 * typed API data.
 *
 * @param props.game - The processed game data for one MLB game.
 */
export function AdvancedGameAnalysis({ game }: AdvancedGameAnalysisProps) {
  if (!game?.teams.away || !game.teams.home) {
    return null;
  }

  const away = game.teams.away;
  const home = game.teams.home;
  const awayName = getTeamName(away, 'Away');
  const homeName = getTeamName(home, 'Home');
  const awayRunShare = getRunShare(away, home);
  const homeRunShare = getRunShare(home, away);
  const awayContactQuality = getNumber(away.wOBA);
  const homeContactQuality = getNumber(home.wOBA);
  const awayPowerQuality = getNumber(away.xSLG);
  const homePowerQuality = getNumber(home.xSLG);
  const awayFinishing = getNumber(away.runs) - getNumber(away.expRunsFor);
  const homeFinishing = getNumber(home.runs) - getNumber(home.expRunsFor);
  const awayPrevention = getNumber(away.expRunsAgainst) - getNumber(away.runsAgainst);
  const homePrevention = getNumber(home.expRunsAgainst) - getNumber(home.runsAgainst);
  const awayExpectedDiff = getNumber(away.expRunsFor) - getNumber(away.expRunsAgainst);
  const homeExpectedDiff = getNumber(home.expRunsFor) - getNumber(home.expRunsAgainst);

  const teamRows: TeamAnalysisRow[] = [
    {
      key: 'expected-runs',
      label: 'expRuns',
      away: formatNumber(away.expRunsFor, 2),
      home: formatNumber(home.expRunsFor, 2),
      leader: getLeader(getNumber(away.expRunsFor), getNumber(home.expRunsFor), awayName, homeName),
    },
    {
      key: 'expected-diff',
      label: 'expRun Diff',
      away: formatNumber(awayExpectedDiff, 2),
      home: formatNumber(homeExpectedDiff, 2),
      leader: getLeader(awayExpectedDiff, homeExpectedDiff, awayName, homeName),
    },
    {
      key: 'finishing',
      label: 'Runs Above Exp',
      away: formatNumber(awayFinishing, 2),
      home: formatNumber(homeFinishing, 2),
      leader: getLeader(awayFinishing, homeFinishing, awayName, homeName),
    },
    {
      key: 'prevention',
      label: 'Runs Against Above Expected',
      away: formatNumber(awayPrevention, 2),
      home: formatNumber(homePrevention, 2),
      leader: getLeader(awayPrevention, homePrevention, awayName, homeName),
    },
    {
      key: 'expected-hits',
      label: 'Hits Above Expected',
      away: formatNumber(getNumber(away.hits) - getExpectedHits(away), 2),
      home: formatNumber(getNumber(home.hits) - getExpectedHits(home), 2),
      leader: getLeader(
        getNumber(away.hits) - getExpectedHits(away),
        getNumber(home.hits) - getExpectedHits(home),
        awayName,
        homeName,
      ),
    },
  ];

  const comparisonRows: ComparisonRow[] = [
    {
      key: 'xrun-share',
      label: 'xRun Share',
      away: awayRunShare,
      home: homeRunShare,
      awayWidth: awayRunShare,
      homeWidth: homeRunShare,
      displayAway: formatPercent(awayRunShare),
      displayHome: formatPercent(homeRunShare),
    },
    {
      key: 'contact-quality',
      label: 'Contact Quality',
      away: awayContactQuality,
      home: homeContactQuality,
      awayWidth: getShare(awayContactQuality, homeContactQuality),
      homeWidth: getShare(homeContactQuality, awayContactQuality),
      displayAway: formatNumber(away.wOBA, 3),
      displayHome: formatNumber(home.wOBA, 3),
    },
    {
      key: 'power-quality',
      label: 'Power Quality',
      away: awayPowerQuality,
      home: homePowerQuality,
      awayWidth: getShare(awayPowerQuality, homePowerQuality),
      homeWidth: getShare(homePowerQuality, awayPowerQuality),
      displayAway: formatNumber(away.xSLG, 3),
      displayHome: formatNumber(home.xSLG, 3),
    },
  ];

  const contactThreats = [...game.batters]
    .filter((batter) => getNumber(batter.nPA) > 0)
    .sort((a, b) => getBatterImpact(b) - getBatterImpact(a))
    .slice(0, 5);

  const powerThreats = [...game.batters]
    .filter((batter) => getNumber(batter.nPA) > 0)
    .sort((a, b) => getPowerImpact(b) - getPowerImpact(a))
    .slice(0, 5);

  const pitcherRisks = [...game.pitchers]
    .filter((pitcher) => getNumber(pitcher.battersFaced) > 0)
    .sort((a, b) => getPitcherRisk(a) - getPitcherRisk(b))
    .slice(0, 5);

  return (
    <section className="advanced-analysis" aria-labelledby="advanced-analysis-title">
      <div className="analysis-heading">
        <h2 className="section-title" id="advanced-analysis-title">Game Control</h2>
      </div>

      <div className="control-grid">
        {comparisonRows.map((row) => (
          <div className="control-row hologram-bracket" key={row.key}>
            <div className="control-row-header">
              <span>{row.label}</span>
              <strong>{row.away >= row.home ? awayName : homeName}</strong>
            </div>
            <div className="split-meter" aria-label={`${row.label}: ${awayName} ${row.displayAway}, ${homeName} ${row.displayHome}`}>
              <div className="split-meter-away" style={{ width: `${Math.max(row.awayWidth * 100, 4)}%` }}>
                <span>{row.displayAway}</span>
              </div>
              <div className="split-meter-home" style={{ width: `${Math.max(row.homeWidth * 100, 4)}%` }}>
                <span>{row.displayHome}</span>
              </div>
            </div>
            <div className="control-labels">
              <span>{awayName}</span>
              <span>{homeName}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="analysis-layout">
        <div className="analysis-panel hologram-bracket">
          <h3>Team Story</h3>
          <table className="analysis-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>{awayName}</th>
                <th>{homeName}</th>
                <th>Edge</th>
              </tr>
            </thead>
            <tbody>
              {teamRows.map((row) => (
                <tr key={row.key}>
                  <td>{row.label}</td>
                  <td>{row.away}</td>
                  <td>{row.home}</td>
                  <td>{row.leader}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="analysis-panel hologram-bracket">
          <h3>Contact Threats</h3>
          <table className="analysis-table">
            <thead>
              <tr>
                <th>Batter</th>
                <th>Team</th>
                <th>xTOB</th>
                <th>wOBA</th>
                <th>Avg EV</th>
              </tr>
            </thead>
            <tbody>
              {contactThreats.map((batter) => (
                <tr key={batter.id}>
                  <td>{batter.fullName || `Player ${batter.id}`}</td>
                  <td>{batter.onHomeTeam ? homeName : awayName}</td>
                  <td>{formatNumber(batter.expTimesOnBase, 2)}</td>
                  <td>{formatNumber(batter.wOBA, 3)}</td>
                  <td>{formatNumber(batter.avgExitVelo, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="analysis-panel hologram-bracket">
          <h3>Power Threats</h3>
          <table className="analysis-table">
            <thead>
              <tr>
                <th>Batter</th>
                <th>Team</th>
                <th>xBases</th>
                <th>xSLG</th>
                <th>Max EV</th>
              </tr>
            </thead>
            <tbody>
              {powerThreats.map((batter) => (
                <tr key={batter.id}>
                  <td>{batter.fullName || `Player ${batter.id}`}</td>
                  <td>{batter.onHomeTeam ? homeName : awayName}</td>
                  <td>{formatNumber(batter.expBases, 2)}</td>
                  <td>{formatNumber(batter.xSLG, 3)}</td>
                  <td>{formatNumber(batter.maxExitVelo, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="analysis-panel hologram-bracket">
          <h3>Pitching Suppression</h3>
          <table className="analysis-table">
            <thead>
              <tr>
                <th>Pitcher</th>
                <th>Team</th>
                <th>xRA</th>
                <th>wOBAA</th>
                <th>K%</th>
              </tr>
            </thead>
            <tbody>
              {pitcherRisks.map((pitcher) => {
                const strikeoutRate = getNumber(pitcher.strikeouts) / Math.max(getNumber(pitcher.battersFaced), 1);

                return (
                  <tr key={pitcher.id}>
                    <td>{pitcher.fullName || `Player ${pitcher.id}`}</td>
                    <td>{pitcher.onHomeTeam ? homeName : awayName}</td>
                    <td>{formatNumber(pitcher.expRunsAgainst, 2)}</td>
                    <td>{formatNumber(pitcher.wOBA, 3)}</td>
                    <td>{formatPercent(strikeoutRate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
