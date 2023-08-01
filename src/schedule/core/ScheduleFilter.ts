import FilterAction from "./FilterAction";
import ScheduleActivity from "./ScheduleActivity";

interface ScheduleFilter {
    activity: ScheduleActivity;
    action: FilterAction;
    time: Date;
}

export default ScheduleFilter
