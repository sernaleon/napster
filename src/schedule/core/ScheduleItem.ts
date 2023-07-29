import ScheduleActivity from "./ScheduleActivity";

interface ScheduleItem {
    StartTime: Date;
    EndTime: Date;
    Activity: ScheduleActivity;
}

export default ScheduleItem