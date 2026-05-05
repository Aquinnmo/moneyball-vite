import './WinOMeter.css'
import { type GameTeam } from '../types'

export interface WinOMeterProps {
  /** The away team data, specifically for extracting `expWin` and sub-metrics */
  away: GameTeam | null | undefined;
  /** The home team data, specifically for extracting `expWin` and sub-metrics */
  home: GameTeam | null | undefined;
}

/**
 * WinOMeter Component
 * 
 * Visualizes the win probability of the away and home teams using horizontal 
 * stacked progress bars. Breaks down probability globally, and then by 
 * expected pitching and expected batting values.
 * 
 * @param props.home - {@link GameTeam} The home team metrics.
 * @param props.away - {@link GameTeam} The away team metrics.
 */
export function WinOMeter({ home, away }: WinOMeterProps) {
  let awayPercent = 50;
  let homePercent = 50;

  if (away?.expWin != null && home?.expWin != null) {
    const total = away.expWin + home.expWin;
    if (total > 0) {
      awayPercent = (away.expWin / total) * 100;
      homePercent = (home.expWin / total) * 100;
    }
  }

  let awayBatting = 50;
  let homeBatting = 50;

  if (away?.expWinBat != null && home?.expWinBat != null) {
    const total = away.expWinBat + home.expWinBat;
    if (total > 0) {
      awayBatting = (away.expWinBat / total) * 100;
      homeBatting = (home.expWinBat / total) * 100;
    }
  }

  let awayPitching = 50;
  let homePitching = 50;

  if (away?.expWinPitch != null && home?.expWinPitch != null) {
    const total = away.expWinPitch + home.expWinPitch;
    if (total > 0) {
      awayPitching = (away.expWinPitch / total) * 100;
      homePitching = (home.expWinPitch / total) * 100;
    }
  }

  return (
    <div>
      <div className="win-o-meter-container">
          <div className="win-o-meter-labels">
              <span className="away-label">{away?.abbreviation} ({awayPercent.toFixed(1)}%)</span>
          </div>
          <div className="win-o-meter-bar">
              <div 
              className="win-o-meter-fill away-fill" 
              style={{ width: `${awayPercent}%` }}
              />
              <div 
              className="win-o-meter-fill home-fill" 
              style={{ width: `${homePercent}%` }}
              />
          </div>
          <div className="win-o-meter-labels">
              <span className="home-label">{home?.abbreviation} ({homePercent.toFixed(1)}%)</span>
          </div>
      </div>
      <h3>Pitching</h3>
      <div className="win-o-meter-container">
          <div className="win-o-meter-labels">
              <span className="away-label">{away?.abbreviation} ({awayPitching.toFixed(1)}%)</span>
          </div>
          <div className="win-o-meter-bar">
              <div 
              className="win-o-meter-fill away-fill" 
              style={{ width: `${awayPitching}%` }}
              />
              <div 
              className="win-o-meter-fill home-fill" 
              style={{ width: `${homePitching}%` }}
              />
          </div>
          <div className="win-o-meter-labels">
              <span className="home-label">{home?.abbreviation} ({homePitching.toFixed(1)}%)</span>
          </div>
      </div>
      <h3>Batting</h3>
      <div className="win-o-meter-container">
          <div className="win-o-meter-labels">
              <span className="away-label">{away?.abbreviation} ({awayBatting.toFixed(1)}%)</span>
          </div>
          <div className="win-o-meter-bar">
              <div 
              className="win-o-meter-fill away-fill" 
              style={{ width: `${awayBatting}%` }}
              />
              <div 
              className="win-o-meter-fill home-fill" 
              style={{ width: `${homeBatting}%` }}
              />
          </div>
          <div className="win-o-meter-labels">
              <span className="home-label">{home?.abbreviation} ({homeBatting.toFixed(1)}%)</span>
          </div>
      </div>
    </div>
  )
}
