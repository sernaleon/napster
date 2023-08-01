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
            startTime: this.getLastEndTime(),
            endTime: endTime,
            activity: activity
        };
        this.addItem(item);
    }

    public getLastEndTime(): Date {
        return this._schedule[this._schedule.length - 1].endTime;
    }

    public isValid(filters: ScheduleFilter[]): boolean {
        return filters.every(this.evaluateFilter);
    }

    private evaluateFilter = (filter: ScheduleFilter): boolean => {
        const lastItem = this._schedule[this._schedule.length - 1];
        switch (filter.action) {
            case FilterAction.STARTS:
                return (
                    filter.time > lastItem.startTime || this._schedule.some(item => item.activity === filter.activity && item.startTime.getTime() === filter.time.getTime())
                );
            case FilterAction.ENDS:
                return (
                    filter.time > this.getLastEndTime() || this._schedule.some(item => item.activity === filter.activity && item.endTime.getTime() === filter.time.getTime())
                );
            default:
                throw new Error('Invalid filter action.');
        }
    };

    private newScheduleItem(activity: ScheduleActivity, durationMinutes: number): ScheduleItem {
        const startTime = this.getLastEndTime();
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
        const item: ScheduleItem = {
            startTime: startTime,
            endTime: endTime,
            activity: activity
        };
        return item;
    }
}

export default ScheduleDay
