import { useEffect, useState } from 'react'
import { processSchedule } from './structures/Data'
import type { Schedule } from './structures/Data'
import { Link } from 'react-router';
import './App.css'

function App() {
  const [schedule, setSchedule] = useState<Schedule>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}today-games`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setSchedule(processSchedule(data));
      setLoading(false);
      console.log("Processed the data!");
      })
    .catch((err) => {
      setLoading(false);
      console.log("failure");
      console.error("Error fetching today's games", err)
    });
  }, []);

  return (
    <div>
      <h1>Welcome to Moneyball</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Today's Games:</h2>
            {schedule.map((game) => (
              <Link to={`/game/:${game.gamePk}`}> <h3 key={game.gamePk}> {game.teams.away.team.name} @ {game.teams.home.team.name}</h3></Link>
            ))}
        </div>
      )}
    </div>
  ) 
}

export default App
