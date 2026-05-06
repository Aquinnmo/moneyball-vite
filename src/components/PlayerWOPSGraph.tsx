import type { Batter } from '../types';
import { PlayerMetricGraph } from './PlayerMetricGraph';

export interface PlayerWOPSGraphProps {
  /** The list of batters from the game data */
  batters: Batter[] | undefined;
}

/**
 * PlayerWOPSGraph Component
 * 
 * Wrapper for PlayerMetricGraph specifically for Weighted On-Base Plus Slugging (wOPS).
 * 
 * @param props.batters - Array of batters containing wOPS and metadata.
 */
export function PlayerWOPSGraph({ batters }: PlayerWOPSGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="wOPS"
      title="Weighted On-Base Plus Slugging (wOPS)"
      metricLabel="wOPS"
      roundTo={3}
    />
  );
}

export function PlayerTWOPSGraph({ batters }: PlayerWOPSGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="tOPS"
      title="Total On-Base Plus Slugging (tOPS)"
      metricLabel="tOPS"
      roundTo={3}
    />
  );
}