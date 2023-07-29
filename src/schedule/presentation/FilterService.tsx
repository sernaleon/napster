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
              Activity: this.stringToActivity(value),
              Action: this.stringToAction(array[index + 1]),
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

  stringToAction(input: String): FilterAction {
    const formattedString = input.trim().toLowerCase();

    switch (formattedString) {
      case 'starts':
        return FilterAction.Starts;
      case 'ends':
        return FilterAction.Ends;
      default:
        throw new Error("Invalid action");
    }
  }

  stringToActivity(input: String): ScheduleActivity {
    const formattedString = input.trim().toLowerCase();

    switch (formattedString) {
      case 'nap':
        return ScheduleActivity.Nap;
      case 'awake':
        return ScheduleActivity.Awake;
      case 'nighttime':
        return ScheduleActivity.NightTime;
      default:
        throw new Error("Invalid activity");
    }
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
