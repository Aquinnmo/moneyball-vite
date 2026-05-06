import type { Pitcher } from '../types';
import { PitcherMetricGraph } from './PitcherMetricGraph';

export interface PitcherExpTimesOnBaseGraphProps {
  pitchers: Pitcher[] | undefined;
}

export function PitcherExpTimesOnBaseGraph({ pitchers }: PitcherExpTimesOnBaseGraphProps) {
  return (
    <PitcherMetricGraph 
      pitchers={pitchers}
      metricKey="expTimesOnBase"
      title="Expected Times On Base"
      metricLabel="Exp Times On Base"
      roundTo={2}
    />
  );
}