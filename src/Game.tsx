import { useEffect, useState } from 'react'
import './Game.css'
import { useParams } from 'react-router';
import type { GameData } from './types'
import { 
  OrbitalSpinner,
  TeamTable, 
  WinOMeter, 
  PlayerXBAGraph, 
  PlayerWOBAGraph, 
  PlayerXSLGGraph, 
  PlayerWOPSGraph, 
  PlayerHitsGraph, 
  PlayerExpBasesGraph, 
  PlayerExpTOBGraph, 
  PlayerTWOPSGraph,
  PlayerAvgExitVeloGraph,
  PlayerMaxExitVeloGraph,
  PlayerAvgBatSpeedGraph,
  PlayerMaxBatSpeedGraph,
  PitcherXBAAGraph,
  PitcherWOBAAGraph,
  PitcherXSLGAGraph,
  PitcherOutsGraph,
  PitcherAvgLAGraph,
  PitcherExpTimesOnBaseGraph,
  PitcherExpBasesGraph,
  PitcherExpRunsAgainstGraph,
  PitcherAvgBatSpeedGraph,
  PitcherMaxBatSpeedGraph
} from './components'
import { getGame } from './api'

/**
 * Game Component
 * 
 * Displays the detailed box score and advanced/expected metrics for a specific 
 * baseball game. Fetches game data using the `gamePk` route parameter bridging 
 * into the `TeamTable` and `WinOMeter` components.
 */
export function Game() {
  const { gamePk } = useParams();
  const [game, setGame] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(!!gamePk);

  useEffect(() => {
    if (!gamePk) {
      return;
    }

    getGame(gamePk)
      .then((gameData) => {
        setGame(gameData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error fetching today's games", err);
      });
  }, [gamePk]);

  return (
    <div className="game-container" id='game'>
      {loading ? (
        <OrbitalSpinner message="Crunching game data..." />
      ) : (
        <>
          <div className="game-header">
            <h1>{`${game?.teams.away?.name} @ ${game?.teams.home?.name}`}</h1>
            <h2>{`${game?.dateTime?.officialDate} - ${game?.dateTime?.time} ${game?.dateTime?.ampm}${game?.status == 'F' ? ' (F)' : ''}`}</h2>
          </div>
          <div className='win-o-meter' id="win-o-meter">
            <h2>Win-O-Meter</h2>
            <WinOMeter home={game?.teams.home} away={game?.teams.away} />
          </div>
          <h2 className='section-title'>Team Info</h2>
          <div className="teams-layout">
            <TeamTable team={game?.teams.away} />
            <TeamTable team={game?.teams.home} />
          </div>
          <h2 className='section-title' id="batters">Batter Info</h2>
          <div className='graphs-container'>
            <h3 className='block-title' id='graph-block-title'>Averages</h3>
            <h3 className='block-title' id='graph-block-title'>Totals and Maximums</h3>
            <div className='graphs-layout'>
              <PlayerXBAGraph batters={game?.batters} />
              <PlayerWOBAGraph batters={game?.batters} />
              <PlayerXSLGGraph batters={game?.batters} />
              <PlayerWOPSGraph batters={game?.batters} />
              <PlayerAvgExitVeloGraph batters={game?.batters} />
              <PlayerAvgBatSpeedGraph batters={game?.batters} />
            </div>
            <div className='graphs-layout'>
              <PlayerHitsGraph batters={game?.batters} />
              <PlayerExpTOBGraph batters={game?.batters} />
              <PlayerExpBasesGraph batters={game?.batters} />
              <PlayerTWOPSGraph batters={game?.batters} />
              <PlayerMaxExitVeloGraph batters={game?.batters} />
              <PlayerMaxBatSpeedGraph batters={game?.batters} />
            </div>
          </div>
          <h2 className='section-title' id="pitchers">Pitcher Info</h2>
          <div className='graphs-container'>
            <h3 className='block-title' id='graph-block-title'>Averages</h3>
            <h3 className='block-title' id='graph-block-title'>Totals and Maximums</h3>
            <div className='graphs-layout'>
              <PitcherXBAAGraph pitchers={game?.pitchers} />
              <PitcherWOBAAGraph pitchers={game?.pitchers} />
              <PitcherXSLGAGraph pitchers={game?.pitchers} />
              <PitcherAvgLAGraph pitchers={game?.pitchers} />
              <PitcherAvgBatSpeedGraph pitchers={game?.pitchers} />
            </div>
            <div className='graphs-layout'>
              <PitcherExpRunsAgainstGraph pitchers={game?.pitchers} />
              <PitcherExpTimesOnBaseGraph pitchers={game?.pitchers} />
              <PitcherExpBasesGraph pitchers={game?.pitchers} />
              <PitcherOutsGraph pitchers={game?.pitchers} />
              <PitcherMaxBatSpeedGraph pitchers={game?.pitchers} />
            </div>
          </div>
        </>
      )}
    </div>
  ) 
}
