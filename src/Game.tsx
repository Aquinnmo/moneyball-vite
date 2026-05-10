import { useEffect, useState } from 'react'
import './Game.css'
import { useParams } from 'react-router';
import type { GameData } from './types'
import { 
  OrbitalSpinner,
  TeamTable, 
  WinOMeter, 
  PlayerMetricGraph,
  PitcherMetricGraph,
  CenteredMetricGraph
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
            <h3 className='block-title' id='graph-block-title'>Totals</h3>
            <div className='graphs-layout'>
              <PlayerMetricGraph batters={game?.batters} metricKey="xBa" title="Expected Batting Average (xBA)" metricLabel="xBA" roundTo={3} />
              <PlayerMetricGraph batters={game?.batters} metricKey="wOBA" title="Weighted On-Base Average (wOBA)" metricLabel="wOBA" roundTo={3} />
              <PlayerMetricGraph batters={game?.batters} metricKey="xSLG" title="Expected Slugging Percentage (xSLG)" metricLabel="xSLG" roundTo={3} />
              <PlayerMetricGraph batters={game?.batters} metricKey="wOPS" title="Weighted On-Base Plus Slugging (wOPS)" metricLabel="wOPS" roundTo={3} />
              <PlayerMetricGraph batters={game?.batters} metricKey="avgExitVelo" title="Avg Exit Velo" metricLabel="EV (Avg)" roundTo={2} />
              <PlayerMetricGraph batters={game?.batters} metricKey="avgBatSpeed" title="Avg Bat Speed" metricLabel="BS (Avg)" roundTo={2} />
            </div>
            <div className='graphs-layout'>
              <PlayerMetricGraph batters={game?.batters} metricKey="hits" title="Hits" metricLabel="H" roundTo={0} />
              <PlayerMetricGraph batters={game?.batters} metricKey="expTimesOnBase" title="Expected Times On Base" metricLabel="xTOB" roundTo={2} />
              <PlayerMetricGraph batters={game?.batters} metricKey="expBases" title="Expected Total Bases" metricLabel="expBases" roundTo={2} />
              <PlayerMetricGraph batters={game?.batters} metricKey="tOPS" title="Total On-Base Plus Slugging (tOPS)" metricLabel="tOPS" roundTo={3} />
              <PlayerMetricGraph batters={game?.batters} metricKey="maxExitVelo" title="Max Exit Velo" metricLabel="EV (Max)" roundTo={2} />
              <PlayerMetricGraph batters={game?.batters} metricKey="maxBatSpeed" title="Max Bat Speed" metricLabel="BS (Max)" roundTo={2} />
            </div>
          </div>
          <h2 className='section-title' id="pitchers">Pitcher Info</h2>
          <div className='graphs-container'>
            <h3 className='block-title' id='graph-block-title'>Averages</h3>
            <h3 className='block-title' id='graph-block-title'>Totals and Maximums</h3>
            <div className='graphs-layout'>
              <PitcherMetricGraph pitchers={game?.pitchers} metricKey="xBA" title="Expected Batting Average Against (xBAA)" metricLabel="xBAA" roundTo={3} />
              <PitcherMetricGraph pitchers={game?.pitchers} metricKey="wOBA" title="Weighted On-Base Average Against (wOBAA)" metricLabel="wOBAA" roundTo={3} />
              <PitcherMetricGraph pitchers={game?.pitchers} metricKey="xSLG" title="Expected Slugging Percentage Against (xSLGA)" metricLabel="xSLGA" roundTo={3} />
              <CenteredMetricGraph pitchers={game?.pitchers} metricKey="avgLA" title="Average Launch Angle (LA)" metricLabel="Avg LA" roundTo={2} />
              <PitcherMetricGraph pitchers={game?.pitchers} metricKey="avgBatSpeed" title="Average Bat Speed Against" metricLabel="Avg Bat Speed" roundTo={2} />,
              <PitcherMetricGraph pitchers={game?.pitchers} metricKey="strikeouts" title="Strikeouts" metricLabel="K" roundTo={0} />,
            </div>
            <div className='graphs-layout'>
              <PitcherMetricGraph pitchers={game?.pitchers} metricKey="expRunsAgainst" title="Expected Runs Against" metricLabel="Exp Runs Against" roundTo={2} />
              <PitcherMetricGraph pitchers={game?.pitchers} metricKey="expTimesOnBase" title="Expected Times On Base" metricLabel="Exp Times On Base" roundTo={2} />
              <PitcherMetricGraph pitchers={game?.pitchers} metricKey="expBases" title="Expected Bases" metricLabel="Exp Bases" roundTo={2} />
              <PitcherMetricGraph pitchers={game?.pitchers} metricKey="outs" title="Outs Recorded" metricLabel="Outs" roundTo={0} />
              <PitcherMetricGraph pitchers={game?.pitchers} metricKey="maxBatSpeed" title="Max Bat Speed Against" metricLabel="Max Bat Speed" roundTo={2} />
              <PitcherMetricGraph pitchers={game?.pitchers} metricKey="hitsAgainst" title="Hits Against" metricLabel="Hits Against" roundTo={0} />,
            </div>
          </div>
        </>
      )}
    </div>
  ) 
}
