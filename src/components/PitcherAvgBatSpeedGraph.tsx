import type { Pitcher } from '../types';
import { PitcherMetricGraph } from './PitcherMetricGraph';

export interface PitcherAvgBatSpeedGraphProps {
  pitchers: Pitcher[] | undefined;
}

export function PitcherAvgBatSpeedGraph({ pitchers }: PitcherAvgBatSpeedGraphProps) {
  return (
    <PitcherMetricGraph 
      pitchers={pitchers}
      metricKey="avgBatSpeed"
      title="Average Bat Speed Against"
      metricLabel="Avg Bat Speed"
      roundTo={2}
    />
  );
}