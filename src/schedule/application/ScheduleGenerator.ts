import ScheduleActivity from "../core/ScheduleActivity";
import type ScheduleConfiguration from "../core/ScheduleConfiguration";
import ScheduleDay from "./ScheduleDay";
import ScheduleFilter from "../core/ScheduleFilter";
import ScheduleItem from "../core/ScheduleItem";

class ScheduleGenerator {
    private readonly _configuration: ScheduleConfiguration;

    constructor(configuration: ScheduleConfiguration) {
        this._configuration = configuration;
    }

    public generateSchedules(filters: ScheduleFilter[]): ScheduleItem[][] {
        const schedules: ScheduleItem[][] = [];

        let startTime = this._configuration.StartOfSchedule;
        let endTime = this._configuration.WakeUpTimeMax;

        while (endTime >= this._configuration.WakeUpTimeMin) {
            const scheduleDay = new ScheduleDay();
            const item: ScheduleItem = {
                StartTime: startTime,
                EndTime: endTime,
                Activity: ScheduleActivity.NightTime
            };
            scheduleDay.addItem(item);

            this.addAwake(schedules, scheduleDay, filters);

            endTime = new Date(endTime.getTime() - this._configuration.TimeIncrementMinutes * 60 * 1000);
        }

        return schedules;
    }

    private addNap(results: ScheduleItem[][], current: ScheduleDay, filters: ScheduleFilter[]): void {
        if (!current.isValid(filters) || current.getLastEndTime() > this._configuration.BedTimeMax) {
            return;
        }

        if (current.getLastEndTime() >= this._configuration.BedTimeMin) {
            current.add(ScheduleActivity.NightTime, this._configuration.EndOfSchedule);
            const schedule = current.getSchedule();
            results.push(schedule);
            return;
        }

        let napTimeMinutes = this._configuration.NapTimeMinutesMax;

        while (napTimeMinutes >= this._configuration.NapTimeMinutesMin) {
            const schedule = current.newWith(ScheduleActivity.Nap, napTimeMinutes);
            this.addAwake(results, schedule, filters);

            napTimeMinutes -= this._configuration.TimeIncrementMinutes;
        }
    }

    private addAwake(results: ScheduleItem[][], current: ScheduleDay, filters: ScheduleFilter[]): void {
        if (!current.isValid(filters) || current.getLastEndTime() > this._configuration.BedTimeMax) {
            return;
        }

        let awakeTimeMinutes = this._configuration.AwakeTimeMinutesMax;

        while (awakeTimeMinutes >= this._configuration.AwakeTimeMinutesMin) {
            const schedule = current.newWith(ScheduleActivity.Awake, awakeTimeMinutes);
            this.addNap(results, schedule, filters);

            awakeTimeMinutes -= this._configuration.TimeIncrementMinutes;
        }
    }
}

export default ScheduleGenerator
