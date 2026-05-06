import type { Pitcher } from '../types';
import { CenteredMetricGraph } from './CenteredMetricGraph';

export interface PitcherAvgLAGraphProps {
  pitchers: Pitcher[] | undefined;
}

export function PitcherAvgLAGraph({ pitchers }: PitcherAvgLAGraphProps) {
  return (
    <CenteredMetricGraph 
      pitchers={pitchers}
      metricKey="avgLA"
      title="Average Launch Angle (LA)"
      metricLabel="Avg LA"
      roundTo={2}
    />
  );
}