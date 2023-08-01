import { Component } from 'react';
import ScheduleConfiguration from '../schedule/core/ScheduleConfiguration';

interface ConfigurationState {
    configurationProperties: ConfigurationProperty[]
}

interface ConfigurationProps {
    config: ScheduleConfiguration;
    onConfigChange: (updatedConfig: ScheduleConfiguration) => void;
}

enum InputType {
    TIME,
    NUMBER
}

interface ConfigurationProperty {
    label: string;
    name: keyof ScheduleConfiguration;
    hours?: number;
    minutes?: number;
    value?: number;
    type: InputType;
}

export default class Configuration extends Component<ConfigurationProps, ConfigurationState> {
    state: ConfigurationState = {
        configurationProperties: []
    }

    componentDidMount(): void {
        const configurationProperties: ConfigurationProperty[]= [
            { label: 'Time Increment (minutes)', name: 'timeIncrementMinutes', value: this.props.config.timeIncrementMinutes, type: InputType.NUMBER },
            { label: 'Start Of Schedule', name: 'startOfSchedule', hours: this.props.config.startOfSchedule.getHours(), minutes: this.props.config.startOfSchedule.getMinutes(), type: InputType.TIME },
            { label: 'Wake Up Time (Min)', name: 'wakeUpTimeMin', hours: this.props.config.wakeUpTimeMin.getHours(), minutes: this.props.config.wakeUpTimeMin.getMinutes(), type: InputType.TIME },
            { label: 'Wake Up Time (Max)', name: 'wakeUpTimeMax', hours: this.props.config.wakeUpTimeMax.getHours(), minutes: this.props.config.wakeUpTimeMax.getMinutes(), type: InputType.TIME },
            { label: 'Bed Time (Min)', name: 'bedTimeMin', hours: this.props.config.bedTimeMin.getHours(), minutes: this.props.config.bedTimeMin.getMinutes(), type: InputType.TIME },
            { label: 'Bed Time (Max)', name: 'bedTimeMax', hours: this.props.config.bedTimeMax.getHours(), minutes: this.props.config.bedTimeMax.getMinutes(), type: InputType.TIME },
            { label: 'End Of Schedule', name: 'endOfSchedule', hours: this.props.config.endOfSchedule.getHours(), minutes: this.props.config.endOfSchedule.getMinutes(), type: InputType.TIME },
            { label: 'Nap Time (Minutes Min)', name: 'napTimeMinutesMin', value: this.props.config.napTimeMinutesMin, type: InputType.NUMBER },
            { label: 'Nap Time (Minutes Max)', name: 'napTimeMinutesMax', value: this.props.config.napTimeMinutesMax, type: InputType.NUMBER },
            { label: 'Awake Time (Minutes Min)', name: 'awakeTimeMinutesMin', value: this.props.config.awakeTimeMinutesMin, type: InputType.NUMBER },
            { label: 'Awake Time (Minutes Max)', name: 'awakeTimeMinutesMax', value: this.props.config.awakeTimeMinutesMax, type: InputType.NUMBER },
            { label: 'Target Nap Count', name: 'targetNapCount', value: this.props.config.targetNapCount, type: InputType.NUMBER },
            { label: 'Target Nap Hours', name: 'targetNapHours', value: this.props.config.targetNapHours, type: InputType.NUMBER },
            { label: 'Target Awake Hours', name: 'targetAwakeHours', value: this.props.config.targetAwakeHours, type: InputType.NUMBER },
            { label: 'Target Night Hours', name: 'targetNightHours', value: this.props.config.targetNightHours, type: InputType.NUMBER },
            { label: 'Target Total Sleep Hours', name: 'targetTotalSleepHours', value: this.props.config.targetTotalSleepHours, type: InputType.NUMBER },
        ];
        this.setState({ configurationProperties });
    }


    handleUpdateClick() {
        const updatedConfig: ScheduleConfiguration = { ...this.props.config };

        // Loop through the configuration properties to update the values
        for (const property of this.state.configurationProperties) {
          if (property.type === InputType.TIME && property.hours !== undefined && property.minutes !== undefined) {
            const updatedTime = new Date(0, 0, 0, property.hours, property.minutes);
            updatedConfig[property.name] = updatedTime as any;
          } else if (property.type === InputType.NUMBER && property.value !== undefined) {
            updatedConfig[property.name] = property.value as any;
          }
        }
    
        this.props.onConfigChange(updatedConfig);
    }

    render() {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Setting</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.configurationProperties.map((property) => (
                            <tr className='row' key={property.name}>
                                <td className='col-6'>{property.label}</td>
                                <td className='col-6'>
                                    {property.type === InputType.NUMBER ? (
                                        <input className='row'
                                            type="number"
                                            value={property.value}
                                            min={0}
                                            onChange={(e) => {
                                              // Update the value of the property in the state
                                              property.value = parseInt(e.target.value, 10);
                                              this.forceUpdate(); // Force re-render to update the input value
                                            }}
                                        />
                                    ) : property.type === InputType.TIME ? (
                                        <div className='row'>
                                            <input className='col-5'
                                                type="number"
                                                value={property.hours}
                                                onChange={(e) => {
                                                  property.hours = parseInt(e.target.value, 10);
                                                  this.forceUpdate();
                                                }}
                                                min={0}
                                                max={23}
                                            />
                                            :
                                            <input className='col-5'
                                                type="number"
                                                value={property.minutes}
                                                onChange={(e) => {
                                                  property.minutes = parseInt(e.target.value, 10);
                                                  this.forceUpdate();
                                                }}
                                                min={0}
                                                max={59}
                                                step={this.props.config.timeIncrementMinutes}
                                            />
                                        </div>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={() => this.handleUpdateClick()}>Update</button>
            </div>
        );
    }
}