import { z } from 'zod';

const JsonRecordSchema = z.record(z.string(), z.unknown());
export const maybe = <T extends z.ZodTypeAny>(schema: T) => schema.nullable().optional();

export const ScheduleTeamSchema = z.object({
    team: z.object({
        id: z.number().positive(),
        name: z.string(),
    }),
    leagueRecord: z.object({
        wins: z.number().nonnegative(),
        losses: z.number().nonnegative(),
        pct: z.string(),
    }),
    splitSquad: z.boolean(),
    seriesNumber: z.number().positive()
});

export const ScheduleSchema = z.array(
    z.object({
        gamePk: z.number().positive(),
        gameDate: z.string(),
        teams: z.object({
            home: ScheduleTeamSchema,
            away: ScheduleTeamSchema,
        }),
        venue: z.object({
            id: z.number().positive(),
            name: z.string(),
        }),
    })
);

export const PlayerInfoSchema = z.object({
    id: z.number().int(),
    fullName: maybe(z.string()),
    boxscoreName: maybe(z.string()),
});

export const BasicTeamInfoSchema = z.object({
    id: z.number().int(),
    name: maybe(z.string()),
});

export const VenueInfoSchema = z.object({
    id: maybe(z.number().int()),
    name: maybe(z.string()),
    link: maybe(z.string()),
});

export const PositionSchema = z.object({
    code: maybe(z.string()),
    name: maybe(z.string()),
    type: maybe(z.string()),
    abbreviation: maybe(z.string()),
});

export const PlayerStatusSchema = z.object({
    code: maybe(z.string()),
    description: maybe(z.string()),
});

export const PlayerGameStatusSchema = z.object({
    isCurrentBatter: maybe(z.boolean()),
    isCurrentPitcher: maybe(z.boolean()),
    isOnBench: maybe(z.boolean()),
    isSubstitute: maybe(z.boolean()),
});

export const MatchupSideSchema = z.object({
    code: maybe(z.string()),
    description: maybe(z.string()),
});

export const InningStatsSchema = z.object({
    runs: maybe(z.number().int()),
    hits: maybe(z.number().int()),
    errors: maybe(z.number().int()),
    leftOnBase: maybe(z.number().int()),
});

export const InningSchema = z.object({
    num: maybe(z.number().int()),
    ordinalNum: maybe(z.string()),
    home: maybe(InningStatsSchema),
    away: maybe(InningStatsSchema),
});

export const ScoreboardTeamsSchema = z.object({
    home: maybe(InningStatsSchema),
    away: maybe(InningStatsSchema),
});

export const LinescoreSchema = z.object({
    currentInning: maybe(z.number().int()),
    currentInningOrdinal: maybe(z.string()),
    inningState: maybe(z.string()),
    inningHalf: maybe(z.string()),
    isTopInning: maybe(z.boolean()),
    scheduledInnings: maybe(z.number().int()),
    innings: maybe(z.array(InningSchema)),
});

export const PlayResultSchema = z.object({
    type: maybe(z.string()),
    event: maybe(z.string()),
    eventType: maybe(z.string()),
    description: maybe(z.string()),
    rbi: maybe(z.number().int()),
    awayScore: maybe(z.number().int()),
    homeScore: maybe(z.number().int()),
    isOut: maybe(z.boolean()),
});

export const PlayAboutSchema = z.object({
    atBatIndex: maybe(z.number().int()),
    halfInning: maybe(z.string()),
    isTopInning: maybe(z.boolean()),
    inning: maybe(z.number().int()),
    startTime: maybe(z.string()),
    endTime: maybe(z.string()),
    isComplete: maybe(z.boolean()),
    isScoringPlay: maybe(z.boolean()),
    hasOut: maybe(z.boolean()),
    captivatingIndex: maybe(z.number().int()),
});

export const PlayCountSchema = z.object({
    balls: maybe(z.number().int()),
    strikes: maybe(z.number().int()),
    outs: maybe(z.number().int()),
});

export const MatchupSchema = z.object({
    batter: maybe(PlayerInfoSchema),
    batSide: maybe(MatchupSideSchema),
    pitcher: maybe(PlayerInfoSchema),
    pitchHand: maybe(MatchupSideSchema),
});

export const CurrentPlaySchema = z.object({
    result: maybe(PlayResultSchema),
    about: maybe(PlayAboutSchema),
    count: maybe(PlayCountSchema),
    matchup: maybe(MatchupSchema),
    playEvents: maybe(z.array(JsonRecordSchema)),
});

export const ProbablePitchersSchema = z.object({
    away: maybe(PlayerInfoSchema),
    home: maybe(PlayerInfoSchema),
});

export const GameStatsSchema = z.object({
    wpa: maybe(z.object({
        gameWpa: maybe(z.array(JsonRecordSchema)),
        lastPlays: maybe(z.array(JsonRecordSchema)),
        topWpaPlayers: maybe(z.array(JsonRecordSchema)),
    })),
    exitVelocity: maybe(z.object({
        top: maybe(z.array(JsonRecordSchema)),
        lastEV: maybe(z.array(JsonRecordSchema)),
        topDistance: maybe(z.array(JsonRecordSchema)),
    })),
    pitchVelocity: maybe(z.object({
        topPitches: maybe(z.array(JsonRecordSchema)),
        currentPitcher: maybe(z.array(JsonRecordSchema)),
    })),
});

export const TeamStatsSchema = z.object({
    batting: maybe(JsonRecordSchema),
    pitching: maybe(JsonRecordSchema),
    fielding: maybe(JsonRecordSchema),
});

export const BoxscorePlayerSchema = z.object({
    person: maybe(PlayerInfoSchema),
    jerseyNumber: maybe(z.string()),
    position: maybe(PositionSchema),
    status: maybe(PlayerStatusSchema),
    parentTeamId: maybe(z.number().int()),
    battingOrder: maybe(z.string()),
    stats: maybe(TeamStatsSchema),
    seasonStats: maybe(TeamStatsSchema),
    gameStatus: maybe(PlayerGameStatusSchema),
    allPositions: maybe(z.array(PositionSchema)),
});

export const BoxscoreTeamSchema = z.object({
    team: maybe(BasicTeamInfoSchema),
    teamStats: maybe(TeamStatsSchema),
    players: maybe(z.record(z.string(), BoxscorePlayerSchema)),
    batters: maybe(z.array(z.number().int())),
    pitchers: maybe(z.array(z.number().int())),
    bench: maybe(z.array(z.number().int())),
    bullpen: maybe(z.array(z.number().int())),
    battingOrder: maybe(z.array(z.number().int())),
});

export const BoxscoreTeamsSchema = z.object({
    away: maybe(BoxscoreTeamSchema),
    home: maybe(BoxscoreTeamSchema),
});

export const BoxscoreSchema = z.object({
    teams: maybe(BoxscoreTeamsSchema),
    info: maybe(z.array(JsonRecordSchema)),
    note: maybe(z.array(JsonRecordSchema)),
});

export const OfficialSchema = z.object({
    official: maybe(PlayerInfoSchema),
    officialType: maybe(z.string()),
});

export const GameInfoSchema = z.object({
    label: maybe(z.string()),
    value: maybe(z.string()),
});

export const DefenseSchema = z.object({
    pitcher: maybe(PlayerInfoSchema),
    catcher: maybe(PlayerInfoSchema),
    first: maybe(PlayerInfoSchema),
    second: maybe(PlayerInfoSchema),
    third: maybe(PlayerInfoSchema),
    shortstop: maybe(PlayerInfoSchema),
    left: maybe(PlayerInfoSchema),
    center: maybe(PlayerInfoSchema),
    right: maybe(PlayerInfoSchema),
    batter: maybe(PlayerInfoSchema),
    onDeck: maybe(PlayerInfoSchema),
    inHole: maybe(PlayerInfoSchema),
    battingOrder: maybe(z.number().int()),
    team: maybe(BasicTeamInfoSchema),
});

export const OffenseSchema = z.object({
    batter: maybe(PlayerInfoSchema),
    onDeck: maybe(PlayerInfoSchema),
    inHole: maybe(PlayerInfoSchema),
    pitcher: maybe(PlayerInfoSchema),
    battingOrder: maybe(z.number().int()),
    team: maybe(BasicTeamInfoSchema),
    balls: maybe(z.number().int()),
    strikes: maybe(z.number().int()),
    outs: maybe(z.number().int()),
});

export const TeamDataSchema = z.object({
    id: maybe(z.number().int()),
    name: maybe(z.string()),
    link: maybe(z.string()),
    season: maybe(z.number().int()),
    venue: maybe(VenueInfoSchema),
    teamCode: maybe(z.string()),
    fileCode: maybe(z.string()),
    abbreviation: maybe(z.string()),
    teamName: maybe(z.string()),
    locationName: maybe(z.string()),
    firstYearOfPlay: maybe(z.string()),
    shortName: maybe(z.string()),
    franchiseName: maybe(z.string()),
    clubName: maybe(z.string()),
    active: maybe(z.boolean()),
});

export const ScoreboardSchema = z.object({
    gamePk: maybe(z.number().int()),
    linescore: maybe(LinescoreSchema),
    teams: ScoreboardTeamsSchema,
    defense: maybe(DefenseSchema),
    offense: maybe(OffenseSchema),
    stats: maybe(GameStatsSchema),
    currentPlay: maybe(CurrentPlaySchema),
    datetime: maybe(z.object({
        dateTime: maybe(z.string()),
        originalDate: maybe(z.string()),
        officialDate: maybe(z.string()),
        dayNight: maybe(z.string()),
        time: maybe(z.string()),
        ampm: maybe(z.string()),
    })),
    probablePitchers: maybe(ProbablePitchersSchema),
});

export const TopPerformerSchema = z.object({
    player: maybe(BoxscorePlayerSchema),
    type: maybe(z.string()),
    gameScore: maybe(z.number().int()),
    hittingGameScore: maybe(z.number().int()),
});

export const GameSchema = z.object({
    game_status_code: maybe(z.string()),
    game_status: z.string(),
    gamedayType: maybe(z.string()),
    gameDate: maybe(z.string()),
    hasAbs: maybe(z.boolean()),
    scoreboard: maybe(ScoreboardSchema),
    venue_id: z.number().int(),
    home_team_data: maybe(TeamDataSchema),
    away_team_data: maybe(TeamDataSchema),
    team_home_id: maybe(z.number().int()),
    team_away_id: maybe(z.number().int()),
    away_lineup: maybe(z.array(z.number().int())),
    home_lineup: maybe(z.array(z.number().int())),
    away_pitcher_lineup: maybe(z.array(z.number().int())),
    home_pitcher_lineup: maybe(z.array(z.number().int())),
    boxscore: maybe(BoxscoreSchema),
    officials: maybe(z.array(OfficialSchema)),
    info: maybe(z.array(GameInfoSchema)),
    topPerformers: maybe(z.array(TopPerformerSchema)),
});

export function processSchedule(schedule : unknown): Schedule {
    const data = ScheduleSchema.parse(schedule);
    return data;
}

export function processGame(game : unknown): Game {
    const data = GameSchema.parse(game);
    return data;
}

export type Schedule = z.infer<typeof ScheduleSchema>;
export type Game = z.infer<typeof GameSchema>;

export const DateTimeSchema = z.object({
    originalDate: maybe(z.string()),
    officialDate: maybe(z.string()),
    dayNight: maybe(z.string()),
    time: maybe(z.string()),
    ampm: maybe(z.string())
});

export const GameTeamSchema = z.object({
    id: maybe(z.number().int()),
    name: maybe(z.string()),
    abbreviation: maybe(z.string()),
    runs: maybe(z.number().int()),
    runsAgainst: maybe(z.number().int()),
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
    expTimesOn: maybe(z.number()),
    expRunsAgainst: maybe(z.number()),
});

export const BatterSchema = z.object({
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
    tOPS: maybe(z.number()),
    expTimesOnBase: maybe(z.number()),
    expBases: maybe(z.number()),
    maxExitVelo: maybe(z.number()),
    avgBatSpeed: maybe(z.number()),
    maxBatSpeed: maybe(z.number()),
    avgExitVelo: maybe(z.number()),
    onHomeTeam: z.boolean()
});

export const PitcherSchema = z.object({
    id: z.number().int(),
    fullName: maybe(z.string()),
    firstName: maybe(z.string()),
    lastName: maybe(z.string()),
    primaryNumber: maybe(z.string()),
    hitsAgainst: maybe(z.number().int()),
    strikeouts: maybe(z.number().int()),
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
    avgLA: maybe(z.number()),
    avgBatSpeed: maybe(z.number()),
    maxBatSpeed: maybe(z.number()),
    onHomeTeam: z.boolean()
});

export const GameDataSchema = z.object({
    gamePk: z.number().int(),
    dateTime: maybe(DateTimeSchema),
    venue: maybe(z.number().int()),
    status: maybe(z.string()),
    teams: z.object({
        home: maybe(GameTeamSchema),
        away: maybe(GameTeamSchema)
    }),
    batters: z.array(BatterSchema),
    pitchers: z.array(PitcherSchema),
    isStolenGame: z.boolean()
});

export function processGameData(gameData: unknown): GameData {
    return GameDataSchema.parse(gameData);
}

export type GameData = z.infer<typeof GameDataSchema>;
export type Pitcher = z.infer<typeof PitcherSchema>;
export type Batter = z.infer<typeof BatterSchema>;
export type GameTeam = z.infer<typeof GameTeamSchema>;
