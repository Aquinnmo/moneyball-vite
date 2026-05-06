import { useState, useRef } from 'react';
import type { GraphDataPoint } from '../types';
import './CenterBarGraph.css';

export interface CenterBarGraphProps {
  /** The title of the graph */
  title: string;
  /** The generic data to display, consisting of labels, values, home/away status, and tooltip data */
  data: GraphDataPoint[];

  roundTo:number;
}

/**
 * CenterBarGraph Component
 * 
 * A generalized modular horizontal bar graph component with a centered vertical axis.
 * Displays interactive bars (negative left, positive right) with a custom hover tooltip.
 * 
 * @param props.title - The title rendered above the graph
 * @param props.data - Extracted player metadata and metric value
 */
export function CenterBarGraph({ title, data, roundTo }: CenterBarGraphProps) {
  const [hoveredData, setHoveredData] = useState<GraphDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort by value (we could also sort by positive/negative, but sorting by absolute or raw value works, typically highest to lowest raw value)
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const maxAbsVal = Math.max(...data.map(d => Math.abs(d.value)), 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, point: GraphDataPoint) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Default position slightly offset from the mouse pointer
    let x = e.clientX - rect.left + 15;
    let y = e.clientY - rect.top + 15;

    // Check if tooltip might overflow the container or view width
    const estimatedTooltipWidth = 230;
    if (e.clientX + estimatedTooltipWidth > window.innerWidth) {
      x = e.clientX - rect.left - estimatedTooltipWidth - 15;
    }

    // Check if tooltip might overflow the bottom of the screen
    const estimatedTooltipHeight = 280;
    if (e.clientY + estimatedTooltipHeight > window.innerHeight) {
      y = e.clientY - rect.top - estimatedTooltipHeight - 15;
    }

    setHoveredData(point);
    setTooltipPos({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  return (
    <div className="center-bar-graph-container" ref={containerRef}>
      <h3 className="center-bar-graph-title">{title}</h3>
      <div className="center-bar-graph">
        {sortedData.map(point => {
          // Determine the width based on the absolute value relative to maxAbsVal, up to 50% of the entire track.
          const widthPercentage = maxAbsVal > 0 ? (Math.abs(point.value) / maxAbsVal) * 50 : 0;
          const isPositive = point.value >= 0;

          return (
            <div
              key={point.id}
              className="center-bar-row"
              onMouseMove={(e) => handleMouseMove(e, point)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="center-bar-label" title={point.label}>
                {point.label}
              </div>
              <div className="center-bar-track">
                <div
                  className={`center-bar-fill ${point.isHomeTeam ? 'home' : 'away'} ${isPositive ? 'positive' : 'negative'}`}
                  style={{ 
                    width: `${widthPercentage}%`,
                    left: isPositive ? '50%' : `calc(50% - ${widthPercentage}%)`,
                  }}
                >
                  <span className={`center-bar-value-label ${isPositive ? 'positive' : 'negative'} ${widthPercentage > 15 ? 'inside' : 'outside'}`}>
                    {point.value.toFixed(roundTo)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {hoveredData && (
          <div
            className="center-bar-tooltip"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <h4>{hoveredData.label}</h4>
            <div className="center-bar-tooltip-grid">
              {Object.entries(hoveredData.tooltipData).map(([key, val]) => (
                <span key={key} style={{ display: 'contents' }}>
                  <span className="center-bar-tooltip-label">{key}</span>
                  <span className="center-bar-tooltip-val">{val ?? 'N/A'}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
