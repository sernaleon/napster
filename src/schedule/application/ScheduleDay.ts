import FilterAction from "../core/FilterAction";
import ScheduleActivity from "../core/ScheduleActivity";
import ScheduleFilter from "../core/ScheduleFilter";
import ScheduleItem from "../core/ScheduleItem";

class ScheduleDay {
    private readonly _schedule: ScheduleItem[];

    constructor(schedule: ScheduleItem[] = []) {
        this._schedule = schedule;
    }

    public addItem(item: ScheduleItem) {
        this._schedule.push(item);
    }

    public getSchedule(): ScheduleItem[] {
        return this._schedule;
    }

    public newWith(activity: ScheduleActivity, durationMinutes: number): ScheduleDay {
        const item = this.newScheduleItem(activity, durationMinutes);
        const result = new ScheduleDay([...this._schedule, item]);
        return result;
    }

    public add(activity: ScheduleActivity, endTime: Date): void {
        const item: ScheduleItem = {
            StartTime: this.getLastEndTime(),
            EndTime: endTime,
            Activity: activity
        };
        this.addItem(item);
    }

    public getLastEndTime(): Date {
        return this._schedule[this._schedule.length - 1].EndTime;
    }

    public isValid(filters: ScheduleFilter[]): boolean {
        return filters.every(this.evaluateFilter);
    }

    private evaluateFilter = (filter: ScheduleFilter): boolean => {
        const lastItem = this._schedule[this._schedule.length - 1];
        switch (filter.Action) {
            case FilterAction.Starts:
                return (
                    filter.Time > lastItem.StartTime || this._schedule.some(item => item.Activity === filter.Activity && item.StartTime.getTime() === filter.Time.getTime())
                );
            case FilterAction.Ends:
                return (
                    filter.Time > this.getLastEndTime() || this._schedule.some(item => item.Activity === filter.Activity && item.EndTime.getTime() === filter.Time.getTime())
                );
            default:
                throw new Error('Invalid filter action.');
        }
    };

    private newScheduleItem(activity: ScheduleActivity, durationMinutes: number): ScheduleItem {
        const startTime = this.getLastEndTime();
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
        const item: ScheduleItem = {
            StartTime: startTime,
            EndTime: endTime,
            Activity: activity
        };
        return item;
    }
}

export default ScheduleDay
