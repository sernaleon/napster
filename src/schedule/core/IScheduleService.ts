import ScheduleDayMetadata from "./ScheduleDayMetadata";
import ScheduleFilter from "./ScheduleFilter";

interface IScheduleService {
    GetSchedules(filterList: ScheduleFilter[]): ScheduleDayMetadata[];
}

export default IScheduleService


