import ScheduleActivity from "../core/ScheduleActivity";
import type ScheduleConfiguration from "../core/ScheduleConfiguration";
import ScheduleDayMetadata from "../core/ScheduleDayMetadata";
import ScheduleItem from "../core/ScheduleItem";

class ScheduleDayMetadataCalculator {
    public getMetadata(schedule: ReadonlyArray<ScheduleItem>, configuration: ScheduleConfiguration): ScheduleDayMetadata {
        const result: ScheduleDayMetadata = {
            score: this.getScore(schedule, configuration),
            numberOfNaps: this.getNumberOfNaps(schedule),
            napHours: this.getNapHours(schedule),
            awakeHours: this.getAwakeHours(schedule),
            nightHours: this.getNightHours(schedule, configuration),
            totalSleepHours: this.getTotalSleepHours(schedule, configuration),
            activitiesInSpans: this.getActivitiesInSpans(schedule, configuration),
        };
        return result;
    }

    private getScore(schedule: ReadonlyArray<ScheduleItem>, configuration: ScheduleConfiguration): number {
        const napCountScore = this.calculateScore(this.getNumberOfNaps(schedule), configuration.targetNapCount);
        const napHoursScore = this.calculateScore(this.getNapHours(schedule), configuration.targetNapHours);
        const awakeHoursScore = this.calculateScore(this.getAwakeHours(schedule), configuration.targetAwakeHours);
        const nightHoursScore = this.calculateScore(this.getNightHours(schedule, configuration), configuration.targetNightHours);
        const totalSleepHoursScore = this.calculateScore(this.getTotalSleepHours(schedule, configuration), configuration.targetTotalSleepHours);

        const result = napCountScore + napHoursScore + awakeHoursScore + nightHoursScore + totalSleepHoursScore;

        return Math.floor(result);
    }

    private getNumberOfNaps(schedule: ReadonlyArray<ScheduleItem>): number {
        return schedule.filter((x) => x.activity === ScheduleActivity.NAP).length;
    }

    private getNapHours(schedule: ReadonlyArray<ScheduleItem>): number {
        return this.getActivityHours(schedule, ScheduleActivity.NAP);
    }

    private getAwakeHours(schedule: ReadonlyArray<ScheduleItem>): number {
        return this.getActivityHours(schedule, ScheduleActivity.AWAKE);
    }

    private getNightHours(schedule: ReadonlyArray<ScheduleItem>, configuration: ScheduleConfiguration): number {
        return (
            this.getActivityHours(schedule, ScheduleActivity.NIGHT_TIME) +
            24 -
            (configuration.endOfSchedule.getTime() - configuration.startOfSchedule.getTime()) / (1000 * 60 * 60)
        );
    }

    private getTotalSleepHours(schedule: ReadonlyArray<ScheduleItem>, configuration: ScheduleConfiguration): number {
        return this.getNightHours(schedule, configuration) + this.getNapHours(schedule);
    }

    private getActivityHours(schedule: ReadonlyArray<ScheduleItem>, activity: ScheduleActivity): number {
        return (
            schedule
                .filter((x) => x.activity === activity)
                .reduce((sum, item) => sum + (item.endTime.getTime() - item.startTime.getTime()) / (1000 * 60 * 60), 0) || 0
        );
    }

    private getActivitiesInSpans(schedule: ReadonlyArray<ScheduleItem>, configuration: ScheduleConfiguration): string[] {
        const result: string[] = [];
        const endTime = schedule[schedule.length - 1].startTime;

        let timeIterator = schedule[0].startTime;
        while (timeIterator <= endTime) {
            const time = timeIterator;
            const matchingSchedule = schedule.find((item) => time >= item.startTime && time < item.endTime);
            const activity = matchingSchedule?.activity.toString() || '';

            result.push(activity);

            timeIterator = new Date(timeIterator.getTime() + configuration.timeIncrementMinutes * 60 * 1000);
        }

        return result;
    }

    private calculateScore(actual: number, target: number): number {
        return Math.abs(1000 - 100 * Math.abs(actual - target));
    }
}

export default ScheduleDayMetadataCalculator
