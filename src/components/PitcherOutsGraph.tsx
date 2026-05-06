import type { Pitcher } from '../types';
import { PitcherMetricGraph } from './PitcherMetricGraph';

export interface PitcherBattersFacedGraphProps {
  pitchers: Pitcher[] | undefined;
}

export function PitcherOutsGraph({ pitchers }: PitcherBattersFacedGraphProps) {
  return (
    <PitcherMetricGraph 
      pitchers={pitchers}
      metricKey="outs"
      title="Outs Recorded"
      metricLabel="Outs"
      roundTo={0}
    />
  );
}