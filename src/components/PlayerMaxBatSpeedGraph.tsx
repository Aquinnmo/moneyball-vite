import type { Batter } from '../types';
import { PlayerMetricGraph } from './PlayerMetricGraph';

export interface PlayerMaxBatSpeedGraphProps {
  /** The list of batters from the game data */
  batters: Batter[] | undefined;
}

/**
 * PlayerMaxBatSpeedGraph Component
 * 
 * Wrapper for PlayerMetricGraph specifically for Maximum Bat Speed.
 * 
 * @param props.batters - Array of batters containing maxBatSpeed and metadata.
 */
export function PlayerMaxBatSpeedGraph({ batters }: PlayerMaxBatSpeedGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="maxBatSpeed"
      title="Max Bat Speed"
      metricLabel="BS (Max)"
      roundTo={2}
    />
  );
}
