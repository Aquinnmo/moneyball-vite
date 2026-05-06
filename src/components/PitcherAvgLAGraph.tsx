import type { Pitcher } from '../types';
import { PitcherMetricGraph } from './PitcherMetricGraph';

export interface PitcherAvgLAGraphProps {
  pitchers: Pitcher[] | undefined;
}

export function PitcherAvgLAGraph({ pitchers }: PitcherAvgLAGraphProps) {
  return (
    <PitcherMetricGraph 
      pitchers={pitchers}
      metricKey="avgLA"
      title="Average Launch Angle (LA)"
      metricLabel="Avg LA"
      roundTo={2}
    />
  );
}