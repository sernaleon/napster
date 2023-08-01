import ScheduleActivity from "../core/ScheduleActivity";
import type ScheduleConfiguration from "../core/ScheduleConfiguration";
import ScheduleDay from "./ScheduleDay";
import ScheduleFilter from "../core/ScheduleFilter";
import ScheduleItem from "../core/ScheduleItem";

class ScheduleGenerator {
    public generateSchedules(filters: ScheduleFilter[], configuration: ScheduleConfiguration): ScheduleItem[][] {
        const schedules: ScheduleItem[][] = [];

        let startTime = configuration.startOfSchedule;
        let endTime = configuration.wakeUpTimeMax;

        while (endTime >= configuration.wakeUpTimeMin) {
            const scheduleDay = new ScheduleDay();
            const item: ScheduleItem = {
                startTime: startTime,
                endTime: endTime,
                activity: ScheduleActivity.NIGHT_TIME
            };
            scheduleDay.addItem(item);

            this.addAwake(schedules, scheduleDay, filters, configuration);

            endTime = new Date(endTime.getTime() - configuration.timeIncrementMinutes * 60 * 1000);
        }

        return schedules;
    }

    private addNap(results: ScheduleItem[][], current: ScheduleDay, filters: ScheduleFilter[], configuration: ScheduleConfiguration): void {
        if (!current.isValid(filters) || current.getLastEndTime() > configuration.bedTimeMax) {
            return;
        }

        if (current.getLastEndTime() >= configuration.bedTimeMin) {
            current.add(ScheduleActivity.NIGHT_TIME, configuration.endOfSchedule);
            const schedule = current.getSchedule();
            results.push(schedule);
            return;
        }

        let napTimeMinutes = configuration.napTimeMinutesMax;

        while (napTimeMinutes >= configuration.napTimeMinutesMin) {
            const schedule = current.newWith(ScheduleActivity.NAP, napTimeMinutes);
            this.addAwake(results, schedule, filters, configuration);

            napTimeMinutes -= configuration.timeIncrementMinutes;
        }
    }

    private addAwake(results: ScheduleItem[][], current: ScheduleDay, filters: ScheduleFilter[], configuration: ScheduleConfiguration): void {
        if (!current.isValid(filters) || current.getLastEndTime() > configuration.bedTimeMax) {
            return;
        }

        let awakeTimeMinutes = configuration.awakeTimeMinutesMax;

        while (awakeTimeMinutes >= configuration.awakeTimeMinutesMin) {
            const schedule = current.newWith(ScheduleActivity.AWAKE, awakeTimeMinutes);
            this.addNap(results, schedule, filters, configuration);

            awakeTimeMinutes -= configuration.timeIncrementMinutes;
        }
    }
}

export default ScheduleGenerator
