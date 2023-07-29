import './Home.css';
import { Component } from 'react';
import scheduler from '../schedule/Scheduler';
import MetadataToTableMapper from '../schedule/presentation/MetadataToTableMapper';
import { FilterService } from '../schedule/presentation/FilterService';
import Router from '../schedule/presentation/Router';

interface HomeState {
    schedules: string[][];
    loading: boolean;
}

export class Home extends Component<{}, HomeState> {
    state: HomeState = {
        schedules: [],
        loading: true
    };

    componentDidMount() {
        const route = Router.GetRoute();
        const filters = FilterService.getFilters(route);
        const schedules = scheduler.GetSchedules(filters);
        const tables = MetadataToTableMapper.ToScheduleTable(schedules);
        this.setState({ schedules: tables, loading: false });
    }

    render() {
        return (
            <div className="table-container">
                <table className="table table-sm table-bordered">
                    <tbody>
                        {this.state.schedules.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cellValue, columnIndex) => (
                                    <td key={`${rowIndex}-${columnIndex}`} className={cellValue}>{cellValue}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
