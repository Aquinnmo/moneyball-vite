import { z }  from 'zod';

const TeamSchema = z.object({
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

const ScheduleSchema = z.array(
    z.object({
        gamePk: z.number().positive(),
        gameDate: z.string(),
        teams: z.object({
            home: TeamSchema,
            away: TeamSchema,
        }),
        venue: z.object({
            id: z.number().positive(),
            name: z.string(),
        }),
    })
);

export function processSchedule(schedule : unknown): Schedule {
    const data = ScheduleSchema.parse(schedule);
    return data;
}

export type Schedule = z.infer<typeof ScheduleSchema>;