interface ScheduleDayMetadata {
    Score: number;
    NumberOfNaps: number;
    NapHours: number;
    AwakeHours: number;
    NightHours: number;
    TotalSleepHours: number;
    ActivitiesIn30MinuteSpans: string[];
}

export default ScheduleDayMetadata