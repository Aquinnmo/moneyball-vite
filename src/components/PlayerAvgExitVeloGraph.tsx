import type { Batter } from '../types';
import { PlayerMetricGraph } from './PlayerMetricGraph';

export interface PlayerAvgExitVeloGraphProps {
  /** The list of batters from the game data */
  batters: Batter[] | undefined;
}

/**
 * PlayerAvgExitVeloGraph Component
 * 
 * Wrapper for PlayerMetricGraph specifically for Average Exit Velocity.
 * 
 * @param props.batters - Array of batters containing avgExitVelo and metadata.
 */
export function PlayerAvgExitVeloGraph({ batters }: PlayerAvgExitVeloGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="avgExitVelo"
      title="Avg Exit Velo"
      metricLabel="EV (Avg)"
    />
  );
}
