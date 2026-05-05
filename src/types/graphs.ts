export interface GraphDataPoint {
    id: string | number;
    label: string;
    value: number;
    isHomeTeam: boolean;
    tooltipData: Record<string, string | number | null | undefined>;
}
