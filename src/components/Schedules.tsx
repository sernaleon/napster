import './Schedules.css';
import { Component } from 'react';
import scheduler from '../schedule/Scheduler';
import ScheduleFilter from '../schedule/core/ScheduleFilter';
import ScheduleDayMetadata from '../schedule/core/ScheduleDayMetadata';
import ScheduleConfiguration from '../schedule/core/ScheduleConfiguration';

interface SchedulesProps {
  filters: ScheduleFilter[];
  config: ScheduleConfiguration;
}

interface SchedulesState {
  schedules: string[][];
}

export default class Schedules extends Component<SchedulesProps, SchedulesState> {
  state: SchedulesState = {
    schedules: [],
  };

  componentDidUpdate(prevProps: SchedulesProps) {
    if (prevProps.filters !== this.props.filters || this.props.config !== prevProps.config) {
      this.updateSchedules();
    }
  }

  updateSchedules() {
    const { filters, config } = this.props;
    const schedules = scheduler.getSchedules(filters, config);
    const tables = this.toScheduleTable(schedules);
    this.setState({ schedules: tables });
  }

  toScheduleTable(metadatas: ScheduleDayMetadata[]): string[][] {
    const result: string[][] = [];

    const keys = this.generateKeys();

    // Write header
    result[0] = [metadatas.length.toString(), ...metadatas.map((_, i) => `Schedule ${i + 1}`)];

    // Write keys and values
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      result[i + 1] = [key, ...metadatas.map((metadata) => this.getValue(metadata, i))];
    }

    return result;
  }

  generateKeys(): string[] {
    const activities = this.generateActivities();

    const keys: string[] = [
      ...activities.map((activity) => this.formatTime(activity)),
      "Score",
      "Nap Count",
      "Nap Hours",
      "Awake Hours",
      "Night Hours",
      "Sleep Hours",
    ];

    return keys;
  }

  generateActivities(): Date[] {
    const activities: Date[] = [];
    const { startOfSchedule, endOfSchedule, timeIncrementMinutes } = this.props.config;
    let currentTime = new Date(startOfSchedule);

    while (currentTime < endOfSchedule) {
      activities.push(new Date(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + timeIncrementMinutes);
    }

    return activities;
  }

  getValue(metadata: ScheduleDayMetadata, index: number): string {
    if (index >= metadata.activitiesInSpans.length) {
        const i = index - metadata.activitiesInSpans.length;
        switch (i) {
            case 0:
              return metadata.score.toString();
            case 1:
              return metadata.numberOfNaps.toString();
            case 2:
              return metadata.napHours.toString();
            case 3:
              return metadata.awakeHours.toString();
            case 4:
              return metadata.nightHours.toString();
            case 5:
              return metadata.totalSleepHours.toString();
            default:
              throw new Error("Unreachable error");
          }
    } else {
        return metadata.activitiesInSpans[index]
    }
  }

  formatTime(time: Date): string {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  render() {
    return (
      <div className="table-responsive">
        <table className="table table-sm table-bordered">
          <tbody>
            {this.state.schedules.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cellValue, columnIndex) => (
                  <td key={`${rowIndex}-${columnIndex}`} className={`text-nowrap ${cellValue}`}>
                    {cellValue}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
