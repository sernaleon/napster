interface ScheduleConfiguration {
    TimeIncrementMinutes: number;
    StartOfSchedule: Date;
    WakeUpTimeMin: Date;
    WakeUpTimeMax: Date;
    BedTimeMin: Date;
    BedTimeMax: Date;
    EndOfSchedule: Date;
    NapTimeMinutesMin: number;
    NapTimeMinutesMax: number;
    AwakeTimeMinutesMin: number;
    AwakeTimeMinutesMax: number;
    TargetNapCount: number;
    TargetNapHours: number;
    TargetAwakeHours: number;
    TargetNightHours: number;
    TargetTotalSleepHours: number;
}
export default ScheduleConfiguration
