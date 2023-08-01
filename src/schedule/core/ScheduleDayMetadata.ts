interface ScheduleDayMetadata {
    score: number;
    numberOfNaps: number;
    napHours: number;
    awakeHours: number;
    nightHours: number;
    totalSleepHours: number;
    activitiesIn30MinuteSpans: string[];
}

export default ScheduleDayMetadata