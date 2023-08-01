import { Component } from 'react';
import ScheduleFilter from '../schedule/core/ScheduleFilter';
import ScheduleActivity from '../schedule/core/ScheduleActivity';
import FilterAction from '../schedule/core/FilterAction';

interface FiltersProps {
  filters: ScheduleFilter[];
  onFiltersChange: (updatedFilters: ScheduleFilter[]) => void;
};

interface FiltersState {
  filters: FilterInput[];
};

interface FilterInput {
  activity: string;
  action: string;
  time: string;
}

export default class Filters extends Component<FiltersProps, FiltersState> {
  state: FiltersState = {
    filters: [],
  };

  componentDidMount() {
    this.updateFilters(this.props.filters);
  }

  componentDidUpdate(prevProps: FiltersProps) {
    if (prevProps.filters !== this.props.filters) {
      this.updateFilters(this.props.filters);
    }
  }

  updateFilters(scheduleFilters: ScheduleFilter[]) {
    const filters = scheduleFilters.map((input) => this.toFilterInput(input));
    this.setState({ filters });
  }

  toFilterInput(input: ScheduleFilter): FilterInput {
    const result: FilterInput = {
      activity: input.activity,
      action: input.action,
      time: this.timeToString(input.time)
    }
    return result;
  }

  toScheduleFilter(input: FilterInput): ScheduleFilter {
    const result: ScheduleFilter = {
      activity: input.activity as ScheduleActivity,
      action: input.action as FilterAction,
      time: this.stringToTime(input.time),
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
    updatedFilters[index].activity = value;
    this.setState({ filters: updatedFilters });
  };

  handleActionChange = (index: number, value: string) => {
    const { filters } = this.state;
    const updatedFilters = [...filters];
    updatedFilters[index].action = value;
    this.setState({ filters: updatedFilters });
  };

  handleTimeChange(index: number, value: string): void {
    const { filters } = this.state;
    const updatedFilters = [...filters];
    updatedFilters[index].time = value;
    this.setState({ filters: updatedFilters });
  };

  handleAddFilter = () => {
    const { filters } = this.state;
    var newItem: FilterInput = {
      activity: ScheduleActivity.NAP,
      action: FilterAction.ENDS,
      time: "18:30"
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
            <select className="col-4" value={filter.activity} onChange={(e) => this.handleActivityChange(index, e.target.value)}>
              <option value="Nap">Nap</option>
              <option value="NightTime">NightTime</option>
              <option value="Awake">Awake</option>
            </select>
            <select className="col-3" value={filter.action} onChange={(e) => this.handleActionChange(index, e.target.value)}>
              <option value="Starts">Starts</option>
              <option value="Ends">Ends</option>
            </select>

            <input className="col-3" type="text" value={filter.time} onChange={(e) => this.handleTimeChange(index, e.target.value)} />

            <button className="col-1" onClick={() => this.handleRemoveFilter(index)}>x</button>
          </div>
        ))}
        <button className="col-1" onClick={this.handleAddFilter}>+</button>
        <button onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}