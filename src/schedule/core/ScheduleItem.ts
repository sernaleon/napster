import ScheduleActivity from "./ScheduleActivity";

interface ScheduleItem {
    startTime: Date;
    endTime: Date;
    activity: ScheduleActivity;
}

export default ScheduleItem