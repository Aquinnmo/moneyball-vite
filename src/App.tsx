import { useEffect, useState } from 'react'
import type { Schedule } from './types'
import { Link } from 'react-router';
import { getTodayGames } from './api'
import './App.css'

function getTodayYMD() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(dateStr: string, days: number) {
  const parts = dateStr.split('-');
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * App Component
 * 
 * The main landing page of the application. Displays the schedule of games 
 * for a selected date. Allows the user to navigate between days and click on 
 * individual games to view deeper advanced stats.
 */
export function App() {
  const [schedule, setSchedule] = useState<Schedule>([])
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => getTodayYMD());

  useEffect(() => {
    getTodayGames(currentDate)
      .then((scheduleData) => {
        setSchedule(scheduleData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error fetching games", err);
      });
  }, [currentDate]);

  const handlePrevDay = () => { setLoading(true); setCurrentDate((prev) => addDays(prev, -1)); };
  const handleNextDay = () => { setLoading(true); setCurrentDate((prev) => addDays(prev, 1)); };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setLoading(true);
      setCurrentDate(e.target.value);
    }
  };

  return (
    <div>
      <h1>Welcome to Moneyball</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handlePrevDay}>Previous Day</button>
        <input 
          type="date" 
          value={currentDate} 
          onChange={handleDateChange} 
          style={{ margin: '0 10px' }}
        />
        <button onClick={handleNextDay}>Next Day</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Games for {currentDate}:</h2>
            {schedule.map((game) => (
              <Link key={game.gamePk} to={`/game/${game.gamePk}`}> <h3> {game.teams.away.team.name} @ {game.teams.home.team.name}</h3></Link>
            ))}
        </div>
      )}
    </div>
  ) 
}
