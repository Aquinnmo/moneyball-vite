import { useState, useRef } from 'react';
import type { GraphDataPoint } from '../types';
import './PlayerBarGraph.css';

export interface PlayerBarGraphProps {
  /** The title of the graph */
  title: string;
  /** The generic data to display, consisting of labels, values, home/away status, and tooltip data */
  data: GraphDataPoint[];

  roundTo: number;
}

/**
 * PlayerBarGraph Component
 * 
 * A generalized modular horizontal bar graph component.
 * Displays interactive bars with a custom hover tooltip.
 * 
 * @param props.title - The title rendered above the graph
 * @param props.data - Extracted player metadata and metric value
 */
export function PlayerBarGraph({ title, data, roundTo }: PlayerBarGraphProps) {
  const [hoveredData, setHoveredData] = useState<GraphDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const maxVal = Math.max(...data.map(d => d.value), 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, point: GraphDataPoint) => {
    // Fixed pointer position
    let x = e.clientX + 15;
    let y = e.clientY + 15;

    // Check if tooltip might overflow the view width
    const estimatedTooltipWidth = 230; // Estimated width
    if (e.clientX + estimatedTooltipWidth > window.innerWidth) {
      x = e.clientX - estimatedTooltipWidth - 15;
    }

    // Check if tooltip might overflow the bottom of the screen
    const estimatedTooltipHeight = 280; // Estimated height for tooltip with a few rows
    if (e.clientY + estimatedTooltipHeight > window.innerHeight) {
      y = window.innerHeight - estimatedTooltipHeight - 15;
    }

    setHoveredData(point);
    setTooltipPos({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  return (
    <div className="player-bar-graph-container" ref={containerRef}>
      <h3 className="player-bar-graph-title">{title}</h3>
      <div className="player-bar-graph">
        {sortedData.map(point => {
          const widthPercentage = maxVal > 0 ? (point.value / maxVal) * 100 : 0;
          return (
            <div 
              key={point.id} 
              className="player-bar-row"
              onMouseMove={(e) => handleMouseMove(e, point)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="player-bar-label" title={point.label}>
                {point.label}
              </div>
              <div className="player-bar-track">
                <div
                  className={`player-bar-fill ${point.isHomeTeam ? 'home' : 'away'}`}
                  style={{ width: `${widthPercentage}%`, position: 'relative' }}
                >
                  <span className={`player-bar-value-label ${widthPercentage > 15 ? 'inside' : 'outside'}`}>
                    {point.value.toFixed(roundTo)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {hoveredData && (
          <div
            className="player-bar-tooltip"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <h4>{hoveredData.label}</h4>
            <div className="player-bar-tooltip-grid">
              {Object.entries(hoveredData.tooltipData).map(([key, val]) => (
                <span key={key} style={{ display: 'contents' }}>
                  <span className="player-bar-tooltip-label">{key}</span>
                  <span className="player-bar-tooltip-val">{val ?? 'N/A'}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
