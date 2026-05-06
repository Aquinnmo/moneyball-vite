import type { Batter } from '../types';
import { PlayerMetricGraph } from './PlayerMetricGraph';

export interface PlayerHitsGraphProps {
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
export function PlayerHitsGraph({ batters }: PlayerHitsGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="hits"
      title="Hits"
      metricLabel="H"
      roundTo={0}
    />
  );
}
