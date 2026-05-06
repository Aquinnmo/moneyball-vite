import type { Pitcher } from '../types';
import { PitcherMetricGraph } from './PitcherMetricGraph';

export interface PitcherWOBAAGraphProps {
  pitchers: Pitcher[] | undefined;
}

export function PitcherWOBAAGraph({ pitchers }: PitcherWOBAAGraphProps) {
  return (
    <PitcherMetricGraph 
      pitchers={pitchers}
      metricKey="wOBA"
      title="Weighted On-Base Average Against (wOBAA)"
      metricLabel="wOBAA"
      roundTo={3}
    />
  );
}