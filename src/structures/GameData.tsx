import { z } from 'zod';

const maybe = <T extends z.ZodTypeAny>(schema: T) => schema.nullable().optional();

const DateTimeSchema = z.object({
    originalDate: maybe(z.string()),
    officialDate: maybe(z.string()),
    dayNight: maybe(z.string()),
    time: maybe(z.string()),
    ampm: maybe(z.string())
});

const TeamSchema = z.object({
    id: maybe(z.number().int()),
    name: maybe(z.string()),
    abbreviation: maybe(z.string()),
    runs: maybe(z.number().int()),
    hits: maybe(z.number().int()),
    errors: maybe(z.number().int()),
    leftOnBase: maybe(z.number().int()),
    xBA: maybe(z.number()),
    wOBA: maybe(z.number()),
    xSLG: maybe(z.number()),
    wOPS: maybe(z.number()),
    nPA: maybe(z.number().int()),
    expRunsFor: maybe(z.number()),
    expWin: maybe(z.number()),
    expWinBat: maybe(z.number()),
    expWinPitch: maybe(z.number()),
    expTimesOn: maybe(z.number())
});

const BatterSchema = z.object({
    id: z.number().int(),
    fullName: maybe(z.string()),
    firstName: maybe(z.string()),
    lastName: maybe(z.string()),
    primaryNumber: maybe(z.string()),
    position: maybe(z.string()),
    batHand: maybe(z.string()),
    hits: maybe(z.number().int()),
    runs: maybe(z.number().int()),
    errors: maybe(z.number().int()),
    nPA: maybe(z.number().int()),
    xBa: maybe(z.number()),
    wOBA: maybe(z.number()),
    xSLG: maybe(z.number()),
    wOPS: maybe(z.number()),
    expTimesOnBase: maybe(z.number()),
    expBases: maybe(z.number()),
    maxExitVelo: maybe(z.number()),
    avgBatSpeed: maybe(z.number()),
    maxBatSpeed: maybe(z.number()),
    avgExitVelo: maybe(z.number()),
    onHomeTeam: z.boolean()
});

const PitcherSchema = z.object({
    id: z.number().int(),
    fullName: maybe(z.string()),
    firstName: maybe(z.string()),
    lastName: maybe(z.string()),
    primaryNumber: maybe(z.string()),
    pitchHand: maybe(z.string()),
    xBA: maybe(z.number()),
    wOBA: maybe(z.number()),
    xSLG: maybe(z.number()),
    wOPS: maybe(z.number()),
    expTimesOnBase: maybe(z.number()),
    expBases: maybe(z.number()),
    battersFaced: maybe(z.number().int()),
    outs: maybe(z.number().int()),
    expRunsAgainst: maybe(z.number()),
    maxExitVelo: maybe(z.number()),
    avgExitVelo: maybe(z.number()),
    onHomeTeam: z.boolean()
});

const GameDataSchema = z.object({
    gamePk: z.number().int(),
    dateTime: maybe(DateTimeSchema),
    venue: maybe(z.number().int()),
    status: maybe(z.string()),
    teams: z.object({
        home: maybe(TeamSchema),
        away: maybe(TeamSchema)
    }),
    batters: z.array(BatterSchema),
    pitchers: z.array(PitcherSchema)
});

export function processGameData(gameData: unknown): GameData {
    return GameDataSchema.parse(gameData);
}

export type GameData = z.infer<typeof GameDataSchema>;
export type Pitcher = z.infer<typeof PitcherSchema>;
export type Batter = z.infer<typeof BatterSchema>;
export type Team = z.infer<typeof TeamSchema>;


