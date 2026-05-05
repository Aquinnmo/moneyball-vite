import type { Batter } from '../types';
import { PlayerMetricGraph } from './PlayerMetricGraph';

export interface PlayerXBAGraphProps {
  /** The list of batters from the game data */
  batters: Batter[] | undefined;
}

/**
 * PlayerXBAGraph Component
 * 
 * Wrapper for PlayerMetricGraph specifically for Expected Batting Average (xBA).
 * 
 * @param props.batters - Array of batters containing xBa and metadata.
 */
export function PlayerXBAGraph({ batters }: PlayerXBAGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="xBa"
      title="Expected Batting Average (xBA)"
      metricLabel="xBA"
    />
  );
}
