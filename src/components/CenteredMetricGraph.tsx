import type { Pitcher } from '../types';
import type { GraphDataPoint } from '../types';
import { CenterBarGraph } from './CenterBarGraph';

export interface CenteredMetricGraphProps {
  /** The list of pitchers from the game data */
  pitchers: Pitcher[] | undefined;
  /** The key in the Pitcher object to plot */
  metricKey: keyof Pitcher;
  /** The title of the graph */
  title: string;
  /** The display label for the metric in the tooltip */
  metricLabel: string;

  roundTo: number;
}

/**
 * PitcherMetricGraph Component
 * 
 * A generic wrapper component that transforms Pitcher data into the generic 
 * GraphDataPoint format required by the PlayerBarGraph for a specific metric.
 */
export function CenteredMetricGraph({ pitchers, metricKey, title, metricLabel, roundTo }: CenteredMetricGraphProps) {
  if (!pitchers || pitchers.length === 0) {
    return null;
  }

  // Filter out pitchers with no data for the metric, then map to GraphDataPoint
  const graphData: GraphDataPoint[] = pitchers
    .filter((p) => typeof p[metricKey] === 'number')
    .map((p) => {
      const name = p.fullName || `Player ${p.id}`;
      const val = p[metricKey] as number;
      return {
        id: p.id,
        label: name,
        value: val,
        isHomeTeam: p.onHomeTeam,
        tooltipData: {
          Name: name,
          [metricLabel]: val.toFixed(roundTo),
          'Batters Faced': p.battersFaced ?? 0,
        },
      };
    });

  if (graphData.length === 0) {
    return null;
  }

  return (
    <CenterBarGraph 
      title={title} 
      data={graphData}
      roundTo={roundTo}
    />
  );
}
