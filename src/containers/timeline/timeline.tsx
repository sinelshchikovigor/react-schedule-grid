import * as React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import { WeekModel, TimelineModel } from '../../model';
import { Week, Day } from '../../components';
import { ISchedulerState, SchedulerState } from '../../scheduler.state';
import { TimelineActions } from './timeline.actions';
import { TimelineService } from '../../services';
import { DateTimeService } from '../../services/datetime.service';

interface ITimelineProps {
    gridWidth: number;
    gridScrollBarWidth: number;
    timeline: TimelineModel;
}

class TimelineComponent extends React.Component<ITimelineProps, void> {
    public render() {
        let timelineStartDate: Date = this.props.timeline.startDate;
        let timelineEndDate: Date = this.props.timeline.endDate;
        let weeks: List<WeekModel> = TimelineService.calculateWeeks(
            timelineStartDate,
            timelineEndDate
        );
        let days: List<Date> = DateTimeService.createDateListBetweenTwoDates(
            timelineStartDate,
            timelineEndDate
        );
        let width = this.props.gridWidth - this.props.gridScrollBarWidth;
        let dayWidth = this.props.timeline.dayWidth;
        let weekWidth: number = TimelineService.calculateWeekWidth(
            weeks,
            width
        );

        let weeksEl: List<JSX.Element> = weeks.map((week: WeekModel, key: number) => {
            return <Week key={key} onWeekClick={(week: WeekModel) => this.onWeekClick(week)} week={week} width={weekWidth}></Week>;
        }) as List<JSX.Element>;

        let daysEl = days.map((day, key) => {
            return <Day onDayClick={(day: Date) => this.onDayClick(day)} key={day.toString()} position={this.props.timeline.dayWidth * key} day={day} width={dayWidth}></Day>;
        });

        let style = {
            width: width
        };

        let daysStyle = {
            width: this.props.timeline.fullWidth
        };

        return (
            <div className='timeline' style={style}>
                <ul className='weeks'>
                    {weeksEl}
                </ul>
                <div className='days__wrapper' id='days' style={style}>
                    <ul className='days' style={daysStyle}>
                        {daysEl}
                    </ul>
                </div>
            </div>
        );
    }

    private onDayClick(day: Date) {
        let currentTimeline = this.props.timeline;
        let timeline: TimelineModel = TimelineService.processZooming(
            currentTimeline,
            this.props.gridWidth,
            day,
            DateTimeService.addSeconds(DateTimeService.addDays(day, 1), -1)
        );

        SchedulerState.dispatch(TimelineActions.timelineChanged(
            timeline
        ));
    }

    private onWeekClick(week: WeekModel) {
        let currentTimeline = this.props.timeline;
        let timeline: TimelineModel = TimelineService.processZooming(
            currentTimeline,
            this.props.gridWidth,
            week.weekStart,
            week.weekEnd
        );

        SchedulerState.dispatch(TimelineActions.timelineChanged(
            timeline
        ));
    }
}

const mapStateToProps = (state: ISchedulerState) => {
    return {
        gridWidth: state.grid.gridWidth,
        gridScrollBarWidth: state.grid.gridScrollBarWidth,
        timeline: state.timeline
    };
};

export const Timeline = connect(mapStateToProps)(TimelineComponent);