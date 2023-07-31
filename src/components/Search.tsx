import { Component } from 'react';
import ScheduleFilter from '../schedule/core/ScheduleFilter';
import ScheduleActivity from '../schedule/core/ScheduleActivity';
import FilterAction from '../schedule/core/FilterAction';

type SearchProps = {
  filters: ScheduleFilter[];
  onFiltersChange: (updatedFilters: ScheduleFilter[]) => void;
};

type SearchState = {
  filters: ScheduleFilterInput[];
};

interface ScheduleFilterInput {
  Activity: string;
  Action: string;
  Time: string;
}

export default class Search extends Component<SearchProps, SearchState> {
  state: SearchState = {
    filters: [],
  };

  componentDidMount() {
    this.updateFilters(this.props.filters);
  }

  componentDidUpdate(prevProps: SearchProps) {
    if (prevProps.filters !== this.props.filters) {
      this.updateFilters(this.props.filters);
    }
  }

  updateFilters(scheduleFilters: ScheduleFilter[]) {
    const filters = scheduleFilters.map((input) => this.toFilterInput(input));
    this.setState({ filters });
  }

  toFilterInput(input: ScheduleFilter): ScheduleFilterInput {
    const result: ScheduleFilterInput = {
      Activity: input.Activity,
      Action: input.Action,
      Time: this.timeToString(input.Time)
    }
    return result;
  }

  toScheduleFilter(input: ScheduleFilterInput): ScheduleFilter {
    const result: ScheduleFilter = {
      Activity: input.Activity as ScheduleActivity,
      Action: input.Action as FilterAction,
      Time: this.stringToTime(input.Time),
    };
    return result;
  }

  timeToString(time: Date): string {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  stringToTime(timeString: string): Date {
    const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

    if (timePattern.test(timeString)) {
      const [hours, minutes] = timeString.split(':');
      const time = new Date(0, 0, 0, Number(hours), Number(minutes));
      return time;
    }

    throw new Error('Invalid time format');
  }

  handleActivityChange = (index: number, value: string) => {
    const { filters } = this.state;
    const updatedFilters = [...filters];
    updatedFilters[index].Activity = value;
    this.setState({ filters: updatedFilters });
  };

  handleActionChange = (index: number, value: string) => {
    const { filters } = this.state;
    const updatedFilters = [...filters];
    updatedFilters[index].Action = value;
    this.setState({ filters: updatedFilters });
  };

  handleTimeChange(index: number, value: string): void {
    const { filters } = this.state;
    const updatedFilters = [...filters];
    updatedFilters[index].Time = value;
    this.setState({ filters: updatedFilters });
  };

  handleAddFilter = () => {
    const { filters } = this.state;
    var newItem: ScheduleFilterInput = {
      Activity: ScheduleActivity.Nap,
      Action: FilterAction.Ends,
      Time: "18:30"
    }
    this.setState({ filters: [...filters, newItem] });
  };

  handleRemoveFilter = (index: number) => {
    const { filters } = this.state;
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    this.setState({ filters: updatedFilters });
  };

  handleSubmit = () => {
    const { filters } = this.state;

    const scheduleFilters = filters.map((filter) => this.toScheduleFilter(filter));

    this.props.onFiltersChange(scheduleFilters);
  };

  render() {
    const { filters } = this.state;
    return (
      <div>
        {filters.map((filter, index) => (
          <div className="form-group row" key={index}>
            <select className="col-4" value={filter.Activity} onChange={(e) => this.handleActivityChange(index, e.target.value)}>
              <option value="Nap">Nap</option>
              <option value="NightTime">NightTime</option>
              <option value="Awake">Awake</option>
            </select>
            <select className="col-3" value={filter.Action} onChange={(e) => this.handleActionChange(index, e.target.value)}>
              <option value="Starts">Starts</option>
              <option value="Ends">Ends</option>
            </select>

            <input className="col-3" type="text" value={filter.Time} onChange={(e) => this.handleTimeChange(index, e.target.value)} />

            <button className="col-1" onClick={() => this.handleRemoveFilter(index)}>x</button>
          </div>
        ))}
        <button className="col-1" onClick={this.handleAddFilter}>+</button>
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}