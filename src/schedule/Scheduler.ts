import ScheduleGenerator from './application/ScheduleGenerator';
import ScheduleDayMetadataCalculator from './application/ScheduleDayMetadataCalculator';
import IScheduleService from './core/IScheduleService';
import ScheduleService from './application/ScheduleService';

const metadataCalculator = new ScheduleDayMetadataCalculator();
const scheduleGenerator = new ScheduleGenerator();
const scheduler: IScheduleService = new ScheduleService(scheduleGenerator, metadataCalculator);

export default scheduler;