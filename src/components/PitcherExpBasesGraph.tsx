import type { Pitcher } from '../types';
import { PitcherMetricGraph } from './PitcherMetricGraph';

export interface PitcherExpBasesGraphProps {
  pitchers: Pitcher[] | undefined;
}

export function PitcherExpBasesGraph({ pitchers }: PitcherExpBasesGraphProps) {
  return (
    <PitcherMetricGraph 
      pitchers={pitchers}
      metricKey="expBases"
      title="Expected Bases"
      metricLabel="Exp Bases"
      roundTo={2}
    />
  );
}