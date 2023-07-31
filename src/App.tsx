import Search from './components/Search';
import Home from './components/Home';
import ScheduleFilter from './schedule/core/ScheduleFilter';
import { Component } from 'react';
import ScheduleActivity from './schedule/core/ScheduleActivity';
import FilterAction from './schedule/core/FilterAction';

interface AppState {
  filters: ScheduleFilter[];
}

export default class App extends Component<{}, AppState> {
  state: AppState = {
    filters: []
  };

  componentDidMount() {
    const filters = this.getFiltersFromURL();
    this.setState({ filters });
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

  handleSearchFiltersChange = (updatedFilters: ScheduleFilter[]) => {
    this.setState({ filters: updatedFilters });
  };

  filterToParam(filter: ScheduleFilter) : string {
    return `${filter.Activity}-${filter.Action}-${filter.Time.getHours()}-${filter.Time.getMinutes()}`;
  }

  paramToFilter(param: string) : ScheduleFilter {
    const [activity, action, hours, minutes] = param.split('-');
    const time = new Date(0, 0, 0, parseInt(hours, 10), parseInt(minutes, 10));
  
    return {
      Activity: activity as ScheduleActivity,
      Action: action as FilterAction,
      Time: time,
    };
  }

  render() {
    return (
      <div className='row'>
        <div className='col-9 horizontal-scrollable'>
          <Home filters={this.state.filters} />
        </div>
        <div className='col-3'>
          <Search filters={this.state.filters} onFiltersChange={this.handleSearchFiltersChange}  />
        </div>
      </div>
    );
  }
}