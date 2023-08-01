import ScheduleConfiguration from "./ScheduleConfiguration";
import ScheduleDayMetadata from "./ScheduleDayMetadata";
import ScheduleFilter from "./ScheduleFilter";

interface IScheduleService {
    getSchedules(filterList: ScheduleFilter[], configuration: ScheduleConfiguration): ScheduleDayMetadata[];
}

export default IScheduleService