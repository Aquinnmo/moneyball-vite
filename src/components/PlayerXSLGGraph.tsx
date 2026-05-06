import type { Batter } from '../types';
import { PlayerMetricGraph } from './PlayerMetricGraph';

export interface PlayerXSLGGraphProps {
  /** The list of batters from the game data */
  batters: Batter[] | undefined;
}

/**
 * PlayerXSLGGraph Component
 * 
 * Wrapper for PlayerMetricGraph specifically for Expected Slugging Percentage (xSLG).
 * 
 * @param props.batters - Array of batters containing xSLG and metadata.
 */
export function PlayerXSLGGraph({ batters }: PlayerXSLGGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="xSLG"
      title="Expected Slugging Percentage (xSLG)"
      metricLabel="xSLG"
      roundTo={3}
    />
  );
}

/*
 * @param props.batters - Array of batters containing xSLG and metadata.
 */
export function PlayerExpBasesGraph({ batters }: PlayerXSLGGraphProps) {
  return (
    <PlayerMetricGraph 
      batters={batters}
      metricKey="expBases"
      title="Expected Total Bases"
      metricLabel="expBases"
      roundTo={2}
    />
  );
}