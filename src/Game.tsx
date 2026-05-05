import { useEffect, useState } from 'react'
import './Game.css'
import { useParams } from 'react-router'
import type { GameData } from './types'
import { TeamTable, WinOMeter, PlayerXBAGraph, PlayerWOBAGraph, PlayerXSLGGraph, PlayerWOPSGraph } from './components'
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
    <div className="game-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="game-header">
            <h1>{`${game?.teams.away?.name} @ ${game?.teams.home?.name}`}</h1>
            <h2>{`${game?.dateTime?.officialDate} - ${game?.dateTime?.time} ${game?.dateTime?.ampm}${game?.status == 'F' ? ' (F)' : ''}`}</h2>
          </div>
          <div className='win-o-meter'>
            <h2>Win-O-Meter</h2>
            <WinOMeter home={game?.teams.home} away={game?.teams.away} />
          </div>
          <div className="teams-layout">
            <TeamTable team={game?.teams.away} />
            <TeamTable team={game?.teams.home} />
          </div>
          <div className='graphs-container'>
            <h3 className='block-title' id='graph-block-title'>Averages</h3>
            <h3 className='block-title' id='graph-block-title'>Totals</h3>
            <div className='graphs-layout'>
              <PlayerXBAGraph batters={game?.batters} />
              <PlayerWOBAGraph batters={game?.batters} />
              <PlayerXSLGGraph batters={game?.batters} />
              <PlayerWOPSGraph batters={game?.batters} />
            </div>
            <div className='graphs-layout'></div>
          </div>
        </>
      )}
    </div>
  ) 
}
