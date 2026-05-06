import type { Pitcher } from '../types';
import { PitcherMetricGraph } from './PitcherMetricGraph';

export interface PitcherExpRunsAgainstGraphProps {
  pitchers: Pitcher[] | undefined;
}

export function PitcherExpRunsAgainstGraph({ pitchers }: PitcherExpRunsAgainstGraphProps) {
  return (
    <PitcherMetricGraph 
      pitchers={pitchers}
      metricKey="expRunsAgainst"
      title="Expected Runs Against"
      metricLabel="Exp Runs Against"
      roundTo={2}
    />
  );
}