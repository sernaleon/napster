import Filters from './components/Filters';
import ScheduleFilter from './schedule/core/ScheduleFilter';
import { Component } from 'react';
import ScheduleActivity from './schedule/core/ScheduleActivity';
import FilterAction from './schedule/core/FilterAction';
import Configuration from './components/Configuration';
import ScheduleConfiguration from './schedule/core/ScheduleConfiguration';
import Schedules from './components/Schedules';

interface AppState {
  filters: ScheduleFilter[];
  config: ScheduleConfiguration;
  loading:boolean
}

const DefaultConfig: ScheduleConfiguration = {
  timeIncrementMinutes: 30,
  startOfSchedule: new Date(0, 0, 0, 6, 0), // Date representing 06:00
  wakeUpTimeMin: new Date(0, 0, 0, 6, 30), // Date representing 06:30
  wakeUpTimeMax: new Date(0, 0, 0, 8, 30), // Date representing 08:30
  bedTimeMin: new Date(0, 0, 0, 20, 0), // Date representing 20:00
  bedTimeMax: new Date(0, 0, 0, 20, 0), // Date representing 20:00
  endOfSchedule: new Date(0, 0, 0, 20, 30), // Date representing 20:30
  napTimeMinutesMin: 60,
  napTimeMinutesMax: 120,
  awakeTimeMinutesMin: 60,
  awakeTimeMinutesMax: 120,
  targetNapCount: 4,
  targetNapHours: 5,
  targetAwakeHours: 5,
  targetNightHours: 11,
  targetTotalSleepHours: 16,
};

export default class App extends Component<{}, AppState> {
  state: AppState = {
    filters: [],
    config: DefaultConfig,
    loading: true
  };

  componentDidMount() {
    const filters = this.getFiltersFromURL();
    const config = this.getConfig();
    this.setState({ config, filters });
  }


  getConfig(): ScheduleConfiguration {
    return DefaultConfig;
  }

  componentDidUpdate() {
    this.updateURL();
  }

  getFiltersFromURL(): ScheduleFilter[] {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const filtersParam = urlSearchParams.get('filters');
    if (filtersParam) {
      return filtersParam.split('.').map(x => this.paramToFilter(x));
    }
    return [];
  }

  updateURL() {
    const { filters } = this.state;
    const urlSearchParams = new URLSearchParams();
    const filtersParam = filters.map(x => this.filterToParam(x)).join('.');
    urlSearchParams.append('filters', filtersParam);
    const newURL = `${window.location.pathname}?${urlSearchParams.toString()}`;
    window.history.replaceState(null, '', newURL);
  }

  handleConfigChange(config: ScheduleConfiguration) {
    this.setState({ config });
  }

  handleFiltersChange = (filters: ScheduleFilter[]) => {
    this.setState({ filters });
  };

  filterToParam(filter: ScheduleFilter): string {
    return `${filter.activity}-${filter.action}-${filter.time.getHours()}-${filter.time.getMinutes()}`;
  }

  paramToFilter(param: string): ScheduleFilter {
    const [activity, action, hours, minutes] = param.split('-');
    const time = new Date(0, 0, 0, parseInt(hours, 10), parseInt(minutes, 10));

    return {
      activity: activity as ScheduleActivity,
      action: action as FilterAction,
      time: time,
    };
  }

  render() {
    return (
      <div className='row'>
        <div className='col-xl-9 col-lg-8 col-sm-6 col-12'>
          <Schedules filters={this.state.filters} config={this.state.config} />
        </div>
        <div className='col-xl-3 col-lg-4 col-sm-6 col-12'>
          <div className='row'>
            <Filters filters={this.state.filters} onFiltersChange={(x) => this.handleFiltersChange(x)} />
          </div>
          <div className='row'>
            <Configuration config={this.state.config} onConfigChange={(x) => this.handleConfigChange(x)} />
          </div>
        </div>
      </div>
    );
  }
}
