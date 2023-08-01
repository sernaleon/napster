import IScheduleService from "../core/IScheduleService";
import ScheduleDayMetadata from "../core/ScheduleDayMetadata";
import ScheduleDayMetadataCalculator from "./ScheduleDayMetadataCalculator";
import ScheduleFilter from "../core/ScheduleFilter";
import ScheduleGenerator from "./ScheduleGenerator";
import ScheduleConfiguration from "../core/ScheduleConfiguration";

class ScheduleService implements IScheduleService {
    private readonly _generator: ScheduleGenerator;
    private readonly _metadataCalculator: ScheduleDayMetadataCalculator;

    constructor(generator: ScheduleGenerator, metadataCalculator: ScheduleDayMetadataCalculator) {
        this._generator = generator;
        this._metadataCalculator = metadataCalculator;
    }

    public getSchedules(filterList: ScheduleFilter[], configuration: ScheduleConfiguration): ScheduleDayMetadata[] {
        return this._generator
            .generateSchedules(filterList, configuration)
            .map((schedule) => this._metadataCalculator.getMetadata(schedule, configuration))
            .sort((a, b) => b.score - a.score);
    }
}

export default ScheduleService;
