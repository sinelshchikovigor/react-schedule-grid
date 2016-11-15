import * as React from 'react';
import * as classNames from 'classnames';

import { WeekModel } from '../../../model';
import { DateTimeService } from '../../../services';

interface IWeekProps {
    week: WeekModel;
    width: number;
    onWeekClick: (week: WeekModel) => void;
}

export class Week extends React.Component<IWeekProps, void> {
    public render() {
        let parsedWeekStart = DateTimeService.toDayAndMonthString(this.props.week.weekStart);
        let parsedWeekEnd = DateTimeService.toDayAndMonthString(this.props.week.weekEnd);
        let isCurrentWeek = DateTimeService.isBetween(new Date(), this.props.week.weekStart, this.props.week.weekEnd);
        let prefix = isCurrentWeek ? '\xa0\xa0\xa0' : '';
        let style = {
            width: this.props.width || 0
        };
        let weekTextClassName = classNames({
            'week__text': true,
            'week__text-current': isCurrentWeek
        });

        return (
            <li onClick={(event: any) => this.props.onWeekClick(this.props.week)} className='week' style={style}>
                <span className={weekTextClassName}>{prefix}{parsedWeekStart}- {parsedWeekEnd}</span>
            </li>
        );
    }
}