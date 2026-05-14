import { type GameData } from '../types';
import './KeyInsights.css';

export interface KeyInsightsProps {
  game: GameData | null | undefined;
}

export function KeyInsights({ game }: KeyInsightsProps) {
  if (!game) return null;

  const insights = [];

  if (game.isStolenGame) {
    insights.push("Pitching Stole Game");
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="key-insights-container">
      <h2 className="section-title">Key Insights</h2>
      <div className="insights-list">
        {insights.map((insight, index) => (
          <span key={index} className="insight-tag">
            {insight}
          </span>
        ))}
      </div>
    </div>
  );
}