import type { Batter } from '../types';
import { PlayerMetricGraph } from './PlayerMetricGraph';

export interface PlayerWOBAGraphProps {
  /** The list of batters from the game data */
  batters: Batter[] | undefined;
}

/**
 * PlayerWOBAGraph Component
 * 
 * Wrapper for PlayerMetricGraph specifically for Weighted On-Base Average (wOBA).
 * 
 * @param props.batters - Array of batters containing wOBA and metadata.
 */
export function PlayerWOBAGraph({ batters }: PlayerWOBAGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="wOBA"
      title="Weighted On-Base Average (wOBA)"
      metricLabel="wOBA"
    />
  );
}