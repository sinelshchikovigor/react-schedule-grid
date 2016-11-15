import * as React from 'react';
import { List } from 'immutable';
import * as classNames from 'classnames';

import { Hour } from './hour/Hour';
import { DateTimeService } from '../../../services/datetime.service';

interface IDayProps {
    day: Date;
    position: number;
    width: number;
    onDayClick: (day: Date) => any;
}

export class Day extends React.Component<IDayProps, void> {
    public render() {
        let hours: List<JSX.Element> = List<JSX.Element>();
        let hourWidth: number = (this.props.width - 1) / 6;
        let firstPartOfDay = DateTimeService.getWeekDayName(this.props.day) + ' ' + (this.props.day.getMonth() + 1) + '/';
        let secondPartOfDay = this.props.day.getDate().toString();
        
        secondPartOfDay = secondPartOfDay.length === 1 ? '0' + secondPartOfDay : secondPartOfDay;

        let styles = {
            width: this.props.width || 0,
            left: this.props.position || 0
        };

        for (let i = 0; i < 6; i++) {
            let hour: string = i * 4 >= 10 ? (i * 4).toString() : '0' + (i * 4).toString();
            let hourEl = <Hour key={i} position={hourWidth * i} width={hourWidth} hour={hour}></Hour>;
            hours = hours.push(hourEl);
        }

        let isCurrentDay = DateTimeService.isSameDay(this.props.day, new Date());

        let secondPartClassName = classNames({
            'day__text-current': isCurrentDay,
            'day__text': true
        });

        return (
            <li className='day' onClick={(event: any) => this.onClick(event)} style={styles} key={this.props.day.toString()}>
                <span className='day__text'>{firstPartOfDay}</span><span className={secondPartClassName}>{secondPartOfDay}</span>
                <ul className='hours'>
                    {hours}
                </ul>
            </li>
        );
    }

    private onClick(event: any) {
        this.props.onDayClick(this.props.day);
    }
}