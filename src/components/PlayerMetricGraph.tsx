import type { Batter } from '../types';
import type { GraphDataPoint } from '../types';
import { PlayerBarGraph } from './PlayerBarGraph';

export interface PlayerMetricGraphProps {
  /** The list of batters from the game data */
  batters: Batter[] | undefined;
  /** The key in the Batter object to plot (e.g., 'xBa', 'wOBA') */
  metricKey: keyof Batter;
  /** The title of the graph */
  title: string;
  /** The display label for the metric in the tooltip */
  metricLabel: string;
  
  roundTo: number;
}

/**
 * PlayerMetricGraph Component
 * 
 * A generic wrapper component that transforms Batter data into the generic 
 * GraphDataPoint format required by the PlayerBarGraph for a specific metric.
 * 
 * @param props.batters - Array of batters containing metadata and metrics.
 * @param props.metricKey - The key of the metric to extract from the batter object.
 * @param props.title - The title to display above the graph.
 * @param props.metricLabel - The label for the metric inside the graph's tooltip.
 */
export function PlayerMetricGraph({ batters, metricKey, title, metricLabel, roundTo }: PlayerMetricGraphProps) {
  if (!batters || batters.length === 0) {
    return null;
  }

  // Filter out batters with no data for the metric, then map to GraphDataPoint
  const graphData: GraphDataPoint[] = batters
    .filter((b) => typeof b[metricKey] === 'number')
    .map((b) => {
      const name = b.fullName || `Player ${b.id}`;
      const val = b[metricKey] as number;
      return {
        id: b.id,
        label: name,
        value: val,
        isHomeTeam: b.onHomeTeam,
        tooltipData: {
          Name: name,
          [metricLabel]: val.toFixed(3),
          Hits: b.hits ?? 0,
          PA: b.nPA ?? 0,
        },
      };
    });

  if (graphData.length === 0) {
    return null; // Return null if no stats are available
  }

  return (
    <PlayerBarGraph 
      title={title} 
      data={graphData} 
      roundTo={roundTo}
    />
  );
}
