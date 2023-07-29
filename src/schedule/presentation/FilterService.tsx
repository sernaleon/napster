import ScheduleFilter from '../core/ScheduleFilter';
import ScheduleActivity from '../core/ScheduleActivity';
import FilterAction from '../core/FilterAction';

export class FilterService {

  getFilters(urlFilters: string): ScheduleFilter[] {
    const segments = urlFilters.split('/').filter((str) => str !== '');

    if (segments.length) {
      const result = segments
        .reduce((result: ScheduleFilter[], value, index, array) => {
          if (index % 3 === 0) {
            const filter: ScheduleFilter = {
              Activity: value as ScheduleActivity,
              Action: array[index + 1] as FilterAction,
              Time: this.stringToTime(array[index + 2])
            };
            result.push(filter);
          }
          return result;
        }, []);
      return result;
    }

    return [];
  }

  stringToTime(timeString: string): Date {
    const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

    if (timePattern.test(timeString)) {
      const [hours, minutes] = timeString.split(':');
      const time = new Date(0, 0, 0, Number(hours), Number(minutes));
      return time;
    }

    throw new Error("Invalid action");
  }
}
