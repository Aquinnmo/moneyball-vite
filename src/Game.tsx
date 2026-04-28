import { useEffect, useState } from 'react'
import type { Game } from './structures/Data'
import './App.css'
import { useParams } from 'react-router'
import { processGameData, type GameData } from './structures/GameData'

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
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>{`${game?.teams.away?.name} @ ${game?.teams.home?.name}`}</h1>
          <h2>{`${game?.dateTime?.officialDate} - ${game?.dateTime?.time} ${game?.dateTime?.ampm}`}</h2>
        </div>
      )}
    </div>
  ) 
}

export default GameView;
