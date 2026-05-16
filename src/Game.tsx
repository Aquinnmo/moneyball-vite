import { useEffect, useState } from 'react'
import './Game.css'
import { useParams } from 'react-router';
import type { GameData } from './types'
import { 
  PitchZoneSpinner,
  TeamTable, 
  WinOMeter, 
  KeyInsights,
  AdvancedGameAnalysis,
  GameScoreboard,
  GameStoryHeader,
  BatterDetailTable,
  PitcherDetailTable
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
        <PitchZoneSpinner message="Crunching game data..." />
      ) : (
        <>
          <div className="game-header">
            <h1>{`${game?.teams.away?.name} @ ${game?.teams.home?.name}`}</h1>
            <h2>{`${game?.dateTime?.officialDate} - ${game?.dateTime?.time} ${game?.dateTime?.ampm}${game?.status == 'F' ? ' (F)' : ''}`}</h2>
          </div>
          <GameStoryHeader game={game} />
          <WinOMeter home={game?.teams.home} away={game?.teams.away} />
          <GameScoreboard game={game} />
          <KeyInsights game={game} />
          <AdvancedGameAnalysis game={game} />
          <h2 className='section-title'>Team Stories</h2>
          <div className="teams-layout">
            <TeamTable team={game?.teams.away} opponent={game?.teams.home} />
            <TeamTable team={game?.teams.home} opponent={game?.teams.away} />
          </div>
          <h2 className='section-title' id="batters">Key Players</h2>
          <BatterDetailTable batters={game?.batters} />
          <PitcherDetailTable pitchers={game?.pitchers} />
        </>
      )}
    </div>
  ) 
}
