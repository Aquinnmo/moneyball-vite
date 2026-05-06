import type { Batter } from '../types';
import { PlayerMetricGraph } from './PlayerMetricGraph';

export interface PlayerMaxExitVeloGraphProps {
  /** The list of batters from the game data */
  batters: Batter[] | undefined;
}

/**
 * PlayerMaxExitVeloGraph Component
 * 
 * Wrapper for PlayerMetricGraph specifically for Maximum Exit Velocity.
 * 
 * @param props.batters - Array of batters containing maxExitVelo and metadata.
 */
export function PlayerMaxExitVeloGraph({ batters }: PlayerMaxExitVeloGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="maxExitVelo"
      title="Max Exit Velo"
      metricLabel="EV (Max)"
      roundTo={2}
    />
  );
}
