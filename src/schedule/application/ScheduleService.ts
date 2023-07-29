import IScheduleService from "../core/IScheduleService";
import ScheduleDayMetadata from "../core/ScheduleDayMetadata";
import ScheduleDayMetadataCalculator from "./ScheduleDayMetadataCalculator";
import ScheduleFilter from "../core/ScheduleFilter";
import ScheduleGenerator from "./ScheduleGenerator";

class ScheduleService implements IScheduleService {
    private readonly _generator: ScheduleGenerator;
    private readonly _metadataCalculator: ScheduleDayMetadataCalculator;

    constructor(
        generator: ScheduleGenerator, 
        metadataCalculator: ScheduleDayMetadataCalculator
        ) {
        this._generator = generator;
        this._metadataCalculator = metadataCalculator;
    }

    public GetSchedules(filterList: ScheduleFilter[]): ScheduleDayMetadata[] {
        return this._generator
            .generateSchedules(filterList)
            .map((schedule) => this._metadataCalculator.getMetadata(schedule))
            .sort((a, b) => b.Score - a.Score);
    }
}

export default ScheduleService;
