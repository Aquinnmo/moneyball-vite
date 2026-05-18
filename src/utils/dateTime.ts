import type { GameData, Schedule } from '../types';

type ScheduleGame = Schedule[number];

function parseDateOnly(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function parseInstant(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateYMD(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function addDays(dateStr: string, days: number) {
  const date = parseDateOnly(dateStr);

  if (!date) {
    return dateStr;
  }

  date.setDate(date.getDate() + days);
  return formatDateYMD(date);
}

export function getAvailableDateWindow() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return {
    todayStr: formatDateYMD(today),
    latestAvailableDateStr: formatDateYMD(yesterday),
  };
}

export function formatDisplayDate(dateStr?: string | null) {
  if (!dateStr) {
    return 'Date TBD';
  }

  const date = parseDateOnly(dateStr);

  if (!date) {
    return dateStr;
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getScheduleGameStartTimestamp(game: ScheduleGame) {
  const date = parseInstant(game.scheduledStartUtc);

  return date?.getTime() ?? Number.NEGATIVE_INFINITY;
}

export function formatScheduleGameStartTime(game: ScheduleGame) {
  const date = parseInstant(game.scheduledStartUtc);

  if (!date) {
    return 'Time TBD';
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatGameDateTime(dateTime: GameData['dateTime']) {
  const localDateTime = parseInstant(dateTime?.originalDate);

  if (localDateTime) {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(localDateTime);
  }

  const dateLabel = formatDisplayDate(dateTime?.officialDate);
  const timeLabel = [dateTime?.time, dateTime?.ampm].filter(Boolean).join(' ');

  return timeLabel ? `${dateLabel} - ${timeLabel}` : dateLabel;
}
