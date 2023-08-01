import './Schedules.css';
import { Component } from 'react';
import scheduler from '../schedule/Scheduler';
import ScheduleFilter from '../schedule/core/ScheduleFilter';
import ScheduleDayMetadata from '../schedule/core/ScheduleDayMetadata';
import ScheduleConfiguration from '../schedule/core/ScheduleConfiguration';

interface HomeProps {
    filters: ScheduleFilter[];
    config: ScheduleConfiguration;
}

interface HomeState {
    schedules: string[][];
    loading: boolean;
}

export default class Home extends Component<HomeProps, HomeState> {
    state: HomeState = {
        schedules: [],
        loading: true
    };

    Keys: string[] = [
        "Score",
        "Nap Count",
        "Nap Hours",
        "Awake Hours",
        "Night Hours",
        "Sleep Hours",
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00"
    ];

    componentDidUpdate(prevProps: HomeProps) {
        console.log('hola')
        if (prevProps.filters !== this.props.filters || this.props.config !== prevProps.config) {
            this.updateSchedules();
        }
    }

    updateSchedules() {
        const { filters, config } = this.props;
        console.log('loadin',filters,config, config.awakeTimeMinutesMax)
        const schedules = scheduler.getSchedules(filters, config);
        const tables = this.toScheduleTable(schedules);
        this.setState({ schedules: tables, loading: false });
    }

    toScheduleTable(metadatas: ScheduleDayMetadata[]): string[][] {
        const result: string[][] = [];

        // Write header
        result[0] = [metadatas.length.toString(), ...metadatas.map((_, i) => `Schedule ${i + 1}`)];

        // Write keys and values
        for (let i = 0; i < this.Keys.length; i++) {
            const key = this.Keys[i];
            result[i + 1] = [key, ...metadatas.map(metadata => this.getValue(metadata, i))];
        }

        return result;
    }

    getValue(metadata: ScheduleDayMetadata, index: number): string {
        if (index >= 0 && index < 6) {
            switch (index) {
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
                    throw new Error("Unreachable error")
            }
        } else {
            return metadata.activitiesIn30MinuteSpans[index - 6] || "";
        }
    }

    render() {
        return (
            <div className="table-responsive">
                <table className="table table-sm table-bordered">
                    <tbody>
                        {this.state.schedules.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cellValue, columnIndex) => (
                                    <td key={`${rowIndex}-${columnIndex}`} className={`text-nowrap ${cellValue}`}>{cellValue}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
