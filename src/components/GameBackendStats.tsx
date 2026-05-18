import type { GameData } from '../types';
import { formatGameDateTime } from '../utils/dateTime';
import { BackendKeyValueList, type BackendKeyValueRow } from './BackendKeyValueList';
import { BackendStatsDropdown } from './BackendStatsDropdown';

export interface GameBackendStatsProps {
  /** Processed game payload returned by the backend. */
  game: GameData | null | undefined;
}

function teamLabel(team: GameData['teams']['home']): string {
  return team?.abbreviation || team?.name || 'Unknown';
}

function getGameDetailRows(game: GameData): BackendKeyValueRow[] {

  return [
    { label: 'Game ID', value: game.gamePk },
    { label: 'Status', value: game.status },
    { label: 'Date / Time', value: formatGameDateTime(game.dateTime) },
    { label: 'Venue ID', value: game.venue },
    { label: 'Stolen Game', value: game.isStolenGame },
    { label: 'Away Team', value: teamLabel(game.teams.away) },
    { label: 'Home Team', value: teamLabel(game.teams.home) },
  ];
}

/**
 * GameBackendStats Component
 *
 * Encapsulates backend game data before the full team/player stat sections are added.
 *
 * @param props.game - Processed game payload returned by the backend.
 */
export function GameBackendStats({ game }: GameBackendStatsProps) {
  if (!game) {
    return null;
  }

  const gameRows = getGameDetailRows(game);

  return (
    <BackendStatsDropdown title="Backend Stats">
      <BackendKeyValueList title="Game Details" rows={gameRows} />
    </BackendStatsDropdown>
  );
}
