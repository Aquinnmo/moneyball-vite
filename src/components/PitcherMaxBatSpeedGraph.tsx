import type { Pitcher } from '../types';
import { PitcherMetricGraph } from './PitcherMetricGraph';

export interface PitcherMaxBatSpeedGraphProps {
  pitchers: Pitcher[] | undefined;
}

export function PitcherMaxBatSpeedGraph({ pitchers }: PitcherMaxBatSpeedGraphProps) {
  return (
    <PitcherMetricGraph 
      pitchers={pitchers}
      metricKey="maxBatSpeed"
      title="Max Bat Speed Against"
      metricLabel="Max Bat Speed"
      roundTo={2}
    />
  );
}