export function TeamTable({ team }: { team: any }) { 
    return (
      <div className="team-block">
        <h3 className="team-block-title">{team?.name}</h3>
        
        <div className="table-section">
          <h4>Basic Data</h4>
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
          <h4>Expected Stats</h4>
          <table className="clean-table">
            <thead>
              <tr><th>xBA</th><th>wOBA</th><th>xSLG</th><th>wOPS</th><th>xRunsFor</th><th>xTimesOnBase</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>{team?.xBA != null ? Number(team.xBA).toFixed(3) : 'null'}</td>
                <td>{team?.xBA != null ? Number(team.wOBA).toFixed(3) : 'null'}</td>
                <td>{team?.xBA != null ? Number(team.xSLG).toFixed(3) : 'null'}</td>
                <td>{team?.wOPS != null ? Number(team.wOPS).toFixed(3) : 'null'}</td>
                <td>{team?.expRunsFor != null ? Number(team.expRunsFor).toFixed(2) : 'null'}</td>
                <td>{team?.expTimesOn != null ? Number(team.expTimesOn).toFixed(2) : 'null'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
}
