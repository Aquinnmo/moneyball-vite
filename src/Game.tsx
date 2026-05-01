import { useEffect, useState } from 'react'
import './Game.css'
import { useParams } from 'react-router'
import { processGameData, type GameData } from './structures/GameData'
import { TeamTable } from './components/TeamTable'
import { WinOMeter } from './components/WinOMeter'

function GameView() {
  const [game, setGame] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(true);
  const { gamePk } = useParams();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!gamePk) {
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}game=${gamePk}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setGame(processGameData(data));
      setLoading(false);
      console.log("Processed the data!");
      })
    .catch((err) => {
      setLoading(false);
      console.log("game fetching failure");
      console.error("Error fetching today's games", err)
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
        </>
      )}
    </div>
  ) 
}



export default GameView;
