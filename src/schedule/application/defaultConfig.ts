import ScheduleConfiguration from "../core/ScheduleConfiguration";

const defaultConfig: ScheduleConfiguration = {
    TimeIncrementMinutes: 30,
    StartOfSchedule: new Date(0, 0, 0, 6, 0), // Date representing 06:00
    WakeUpTimeMin: new Date(0, 0, 0, 6, 30), // Date representing 06:30
    WakeUpTimeMax: new Date(0, 0, 0, 8, 30), // Date representing 08:30
    BedTimeMin: new Date(0, 0, 0, 20, 0), // Date representing 20:00
    BedTimeMax: new Date(0, 0, 0, 20, 0), // Date representing 20:00
    EndOfSchedule: new Date(0, 0, 0, 20, 30), // Date representing 20:30
    NapTimeMinutesMin: 60,
    NapTimeMinutesMax: 120,
    AwakeTimeMinutesMin: 60,
    AwakeTimeMinutesMax: 90,
    TargetNapCount: 4,
    TargetNapHours: 5,
    TargetAwakeHours: 5,
    TargetNightHours: 11,
    TargetTotalSleepHours: 16,
  };

  export default defaultConfig;