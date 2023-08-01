interface ScheduleConfiguration {
    timeIncrementMinutes: number;
    startOfSchedule: Date;
    wakeUpTimeMin: Date;
    wakeUpTimeMax: Date;
    bedTimeMin: Date;
    bedTimeMax: Date;
    endOfSchedule: Date;
    napTimeMinutesMin: number;
    napTimeMinutesMax: number;
    awakeTimeMinutesMin: number;
    awakeTimeMinutesMax: number;
    targetNapCount: number;
    targetNapHours: number;
    targetAwakeHours: number;
    targetNightHours: number;
    targetTotalSleepHours: number;
}
export default ScheduleConfiguration
