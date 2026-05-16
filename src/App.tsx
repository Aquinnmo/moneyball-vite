import { useEffect, useState } from 'react'
import type { Schedule } from './types'
import { Link } from 'react-router';
import { getTodayGames } from './api'
import './App.css'
import { BaseballDiamondSpinner } from './components';

function formatDateYMD(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getAvailableDateWindow() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    todayStr: formatDateYMD(today),
    latestAvailableDateStr: formatDateYMD(yesterday),
  };
}

function addDays(dateStr: string, days: number) {
  const parts = dateStr.split('-');
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  d.setDate(d.getDate() + days);
  return formatDateYMD(d);
}

/**
 * App Component
 * 
 * The main landing page of the application. Displays the schedule of games 
 * for a selected date. Allows the user to navigate between days and click on 
 * individual games to view deeper advanced stats.
 */
export function App() {
  const { todayStr, latestAvailableDateStr } = getAvailableDateWindow();
  const [schedule, setSchedule] = useState<Schedule>([])
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => latestAvailableDateStr);
  const nextDate = addDays(currentDate, 1);
  const isNextDayDisabled = nextDate >= todayStr;

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
  const handleNextDay = () => {
    if (!isNextDayDisabled) {
      setLoading(true);
      setCurrentDate(nextDate);
    }
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setLoading(true);
      setCurrentDate(e.target.value > latestAvailableDateStr ? latestAvailableDateStr : e.target.value);
    }
  };

  return (
    <div>
      <h1>Welcome to Moneyball</h1>
      
      <div className="date-controls">
        <button className="date-btn" onClick={handlePrevDay}>Previous Day</button>
        <input 
          type="date" 
          value={currentDate} 
          max={latestAvailableDateStr}
          className="date-input"
          onChange={handleDateChange} 
        />
        <button className="date-btn" onClick={handleNextDay} disabled={isNextDayDisabled}>Next Day</button>
      </div>

      {loading ? (
        <BaseballDiamondSpinner message="Finding games..."/>
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
