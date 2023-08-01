interface ScheduleDayMetadata {
    score: number;
    numberOfNaps: number;
    napHours: number;
    awakeHours: number;
    nightHours: number;
    totalSleepHours: number;
    activitiesInSpans: string[];
}

export default ScheduleDayMetadata