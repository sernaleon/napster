import ScheduleActivity from "../core/ScheduleActivity";
import type ScheduleConfiguration from "../core/ScheduleConfiguration";
import ScheduleDayMetadata from "../core/ScheduleDayMetadata";
import ScheduleItem from "../core/ScheduleItem";

class ScheduleDayMetadataCalculator {
    private readonly _configuration: ScheduleConfiguration;
    
    constructor(configuration: ScheduleConfiguration) {
        this._configuration = configuration;
    }

    public getMetadata(schedule: ReadonlyArray<ScheduleItem>): ScheduleDayMetadata {
        const result: ScheduleDayMetadata = {
            Score: this.getScore(schedule),
            NumberOfNaps: this.getNumberOfNaps(schedule),
            NapHours: this.getNapHours(schedule),
            AwakeHours: this.getAwakeHours(schedule),
            NightHours: this.getNightHours(schedule),
            TotalSleepHours: this.getTotalSleepHours(schedule),
            ActivitiesIn30MinuteSpans: this.getActivitiesIn30MinuteSpans(schedule),
        };
        return result;
    }

    private getScore(schedule: ReadonlyArray<ScheduleItem>): number {
        const napCountScore = this.calculateScore(this.getNumberOfNaps(schedule), this._configuration.TargetNapCount);
        const napHoursScore = this.calculateScore(this.getNapHours(schedule), this._configuration.TargetNapHours);
        const awakeHoursScore = this.calculateScore(this.getAwakeHours(schedule), this._configuration.TargetAwakeHours);
        const nightHoursScore = this.calculateScore(this.getNightHours(schedule), this._configuration.TargetNightHours);
        const totalSleepHoursScore = this.calculateScore(this.getTotalSleepHours(schedule), this._configuration.TargetTotalSleepHours);

        const result = napCountScore + napHoursScore + awakeHoursScore + nightHoursScore + totalSleepHoursScore;

        return Math.floor(result);
    }

    private getNumberOfNaps(schedule: ReadonlyArray<ScheduleItem>): number {
        return schedule.filter((x) => x.Activity === ScheduleActivity.Nap).length;
    }

    private getNapHours(schedule: ReadonlyArray<ScheduleItem>): number {
        return this.getActivityHours(schedule, ScheduleActivity.Nap);
    }

    private getAwakeHours(schedule: ReadonlyArray<ScheduleItem>): number {
        return this.getActivityHours(schedule, ScheduleActivity.Awake);
    }

    private getNightHours(schedule: ReadonlyArray<ScheduleItem>): number {
        return (
            this.getActivityHours(schedule, ScheduleActivity.NightTime) +
            24 -
            (this._configuration.EndOfSchedule.getTime() - this._configuration.StartOfSchedule.getTime()) / (1000 * 60 * 60)
        );
    }

    private getTotalSleepHours(schedule: ReadonlyArray<ScheduleItem>): number {
        return this.getNightHours(schedule) + this.getNapHours(schedule);
    }

    private getActivityHours(schedule: ReadonlyArray<ScheduleItem>, activity: ScheduleActivity): number {
        return (
            schedule
                .filter((x) => x.Activity === activity)
                .reduce((sum, item) => sum + (item.EndTime.getTime() - item.StartTime.getTime()) / (1000 * 60 * 60), 0) || 0
        );
    }

    private getActivitiesIn30MinuteSpans(schedule: ReadonlyArray<ScheduleItem>): string[] {
        const result: string[] = [];
        const endTime = schedule[schedule.length - 1].StartTime;

        let timeIterator = schedule[0].StartTime;
        while (timeIterator <= endTime) {
            const time = timeIterator;
            const matchingSchedule = schedule.find((item) => time >= item.StartTime && time < item.EndTime);
            const activity = matchingSchedule?.Activity.toString() || '';

            result.push(activity);

            timeIterator = new Date(timeIterator.getTime() + 30 * 60 * 1000);
        }

        return result;
    }

    private calculateScore(actual: number, target: number): number {
        return Math.abs(1000 - 100 * Math.abs(actual - target));
    }
}

export default ScheduleDayMetadataCalculator
