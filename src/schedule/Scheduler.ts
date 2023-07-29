import ScheduleGenerator from './application/ScheduleGenerator';
import ScheduleDayMetadataCalculator from './application/ScheduleDayMetadataCalculator';
import IScheduleService from './core/IScheduleService';
import defaultConfig from './application/defaultConfig';
import ScheduleService from './application/ScheduleService';

const config = defaultConfig;
const metadataCalculator = new ScheduleDayMetadataCalculator(config);
const scheduleGenerator = new ScheduleGenerator(config);
const scheduler: IScheduleService = new ScheduleService(scheduleGenerator, metadataCalculator);

export default scheduler;