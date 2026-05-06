import { processSchedule, processGameData, type Schedule, type GameData } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

async function fetchWithRetry(url: string, options?: RequestInit, retries = 2): Promise<Response> {
    let attempt = 0;
    while (attempt <= retries) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new ApiError(response.status, `HTTP Error ${response.status}: ${response.statusText}`);
            }
            return response;
        } catch (err) {
            if (attempt === retries) {
                throw err;
            }
            attempt++;
            await new Promise(r => setTimeout(r, 500 * attempt));
            console.warn(`Retrying fetch to ${url} (attempt ${attempt})`);
        }
    }
    throw new Error("Unreachable");
}

export async function getTodayGames(date: string): Promise<Schedule> {
    const response = await fetchWithRetry(`${BASE_URL}games/${date}`);
    const data = await response.json();
    return processSchedule(data);
}

export async function getGame(gamePk: string | number): Promise<GameData> {
    const response = await fetchWithRetry(`${BASE_URL}game=${gamePk}`);
    const data = await response.json();
    return processGameData(data);
}
