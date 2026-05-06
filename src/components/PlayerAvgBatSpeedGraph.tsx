import type { Batter } from '../types';
import { PlayerMetricGraph } from './PlayerMetricGraph';

export interface PlayerAvgBatSpeedGraphProps {
  /** The list of batters from the game data */
  batters: Batter[] | undefined;
}

/**
 * PlayerAvgBatSpeedGraph Component
 * 
 * Wrapper for PlayerMetricGraph specifically for Average Bat Speed.
 * 
 * @param props.batters - Array of batters containing avgBatSpeed and metadata.
 */
export function PlayerAvgBatSpeedGraph({ batters }: PlayerAvgBatSpeedGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="avgBatSpeed"
      title="Avg Bat Speed"
      metricLabel="BS (Avg)"
      roundTo={2}
    />
  );
}
