import FilterAction from "./FilterAction";
import ScheduleActivity from "./ScheduleActivity";

interface ScheduleFilter {
    Activity: ScheduleActivity;
    Action: FilterAction;
    Time: Date;
}

export default ScheduleFilter
