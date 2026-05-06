import type { Pitcher } from '../types';
import { PitcherMetricGraph } from './PitcherMetricGraph';

export interface PitcherXBAAGraphProps {
  pitchers: Pitcher[] | undefined;
}

export function PitcherXBAAGraph({ pitchers }: PitcherXBAAGraphProps) {
  return (
    <PitcherMetricGraph 
      pitchers={pitchers}
      metricKey="xBA"
      title="Expected Batting Average Against (xBAA)"
      metricLabel="xBAA"
      roundTo={3}
    />
  );
}