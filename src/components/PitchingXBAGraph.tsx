import type { Pitcher } from '../types';
import { PlayerMetricGraph } from './PlayerMetricGraph';

export interface PitcherXBA {
  /** The list of batters from the game data */
  batters: Pitcher[] | undefined;
}

/**
 * @param props.pitchers - Array of batters containing wOBA and metadata.
 */
export function PlayerWOBAGraph({ pitcher }: PlayerWOBAGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="wOBA"
      title="Weighted On-Base Average (wOBA)"
      metricLabel="wOBA"
    />
  );
}