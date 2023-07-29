import { Component } from 'react';
import ScheduleFilter from '../schedule/core/ScheduleFilter';
import ScheduleActivity from '../schedule/core/ScheduleActivity';
import FilterAction from '../schedule/core/FilterAction';
import { FilterService } from '../schedule/presentation/FilterService';

type SearchState = {
  filters: ScheduleFilterInput[];
};

interface ScheduleFilterInput {
  Activity: string;
  Action: string;
  Time: string;
}

class Search extends Component<{}, SearchState> {
  state: SearchState = {
    filters: [],
  };

  componentDidMount() {
    const filters = new FilterService().getFilters(document.location.pathname);
    const filterInputs =  filters.map((input) => this.toFilterInput(input));
    this.setState({ filters: filterInputs });
  }


  toFilterInput(input: ScheduleFilter): ScheduleFilterInput{
    const result : ScheduleFilterInput = {
      Activity: input.Activity,
      Action: input.Action,
      Time: this.timeToString(input.Time)
    }
    return result;
}
  timeToString(time: Date): string {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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

    const url = filters
      .map((filter) => `${filter.Activity}/${filter.Action}/${filter.Time}`)
      .join('/');

    document.location.pathname = url; // this.props.history.push(url); TODO: LEARN REACT ROUTER 
  };

  render() {
    const { filters } = this.state;
    return (
      <div>
        {filters.map((filter, index) => (
          <div className="form-group row" key={index}>
            <select className="col-4" value={filter.Activity} onChange={(e) => this.handleActivityChange(index, e.target.value)}>
              <option value="nighttime">NightTime</option>
              <option value="awake">Awake</option>
              <option value="nap">Nap</option>
            </select>
            <select className="col-3" value={filter.Action} onChange={(e) => this.handleActionChange(index, e.target.value)}>
              <option value="starts">Starts</option>
              <option value="ends">Ends</option>
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

export default Search;