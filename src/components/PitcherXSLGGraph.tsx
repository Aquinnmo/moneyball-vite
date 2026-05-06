import type { Pitcher } from '../types';
import { PitcherMetricGraph } from './PitcherMetricGraph';

export interface PitcherXSLGAGraphProps {
  pitchers: Pitcher[] | undefined;
}

export function PitcherXSLGAGraph({ pitchers }: PitcherXSLGAGraphProps) {
  return (
    <PitcherMetricGraph 
      pitchers={pitchers}
      metricKey="xSLG"
      title="Expected Slugging Percentage Against (xSLGA)"
      metricLabel="xSLGA"
      roundTo={3}
    />
  );
}