import type { GameTeam } from '../types';

export interface TeamTableProps {
  /** The team data containing basic and expected stats to display */
  team: GameTeam | null | undefined;
}

/**
 * TeamTable Component
 * 
 * Renders a data table for a single team in a game. Displays 
 * standard offensive box score stats alongside expected (x) metrics.
 * 
 * @param props.team - {@link GameTeam} The parsed team stats from the API.
 */
export function TeamTable({ team }: TeamTableProps) { 
    return (
      <div className="team-block">
        <h3 className="block-title">{team?.name}</h3>
        
        <div className="table-section">
          <h4>Box Score</h4>
          <table className="clean-table">
            <thead>
              <tr><th>Runs</th><th>Hits</th><th>Errors</th><th>Left On Base</th></tr>
            </thead>
            <tbody>
              <tr><td>{team?.runs}</td><td>{team?.hits}</td><td>{team?.errors}</td><td>{team?.leftOnBase}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="table-section">
          <h4>Expected Batting Stats</h4>
          <table className="clean-table">
            <thead>
              <tr><th>xBA</th><th>wOBA</th><th>xSLG</th><th>wOPS</th><th>xRunsFor</th><th>xTimesOnBase</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>{team?.xBA != null ? Number(team.xBA).toFixed(3) : 'null'}</td>
                <td>{team?.wOBA != null ? Number(team.wOBA).toFixed(3) : 'null'}</td>
                <td>{team?.xSLG != null ? Number(team.xSLG).toFixed(3) : 'null'}</td>
                <td>{team?.wOPS != null ? Number(team.wOPS).toFixed(3) : 'null'}</td>
                <td>{team?.expRunsFor != null ? Number(team.expRunsFor).toFixed(2) : 'null'}</td>
                <td>{team?.expTimesOn != null ? Number(team.expTimesOn).toFixed(2) : 'null'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-section">
          <h4>Batting Above Expected</h4>
          <table className="clean-table">
            <thead>
              <tr><th>Runs Above Expected</th><th>Hits Above Expected</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>{team?.expRunsFor && team?.runs != null ? Number(team?.runs - team?.expRunsFor).toFixed(2) : 'null'}</td>
                <td>{team?.hits && team?.expTimesOn != null ? Number(team?.hits - team?.expTimesOn).toFixed(2) : 'null'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-section">
          <h4>WIP - Expected Pitching Stats</h4>
          <table className="clean-table">
            <thead>
              <tr><th>xRuns Against</th><th>Runs Allowed</th><th>Pitching Above Expected</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>{team?.expRunsAgainst != null ? Number(team.expRunsAgainst).toFixed(2) : 'null'}</td>
                <td>{team?.runs != null ? Number(team.runs) : 'null'}</td>
                <td>{team?.expRunsAgainst && team?.runs != null ? Number(team.expRunsAgainst - team?.runs).toFixed(2) : 'null'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
}
