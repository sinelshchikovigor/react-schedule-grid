import * as React from 'react';

import { Aside, Grid, Timeline } from './containers';
import { SchedulerState, ISchedulerState } from './scheduler.state';
import { SchedulerActions } from './scheduler.actions';
import { TimelineService } from './services/timeline.service';

export class Scheduler extends React.Component<void, void> {
    private ref: HTMLElement;
    private bindedHandleResize: (e: Event) => void;

    constructor(props?: void, context?: any) {
        super(props, context);

        this.bindedHandleResize = this.handleResize.bind(this);
    }

    public componentDidMount() {
        let rect: ClientRect = this.ref.getBoundingClientRect();
        let state: ISchedulerState = SchedulerState.getState();
        let startDate: Date = state.timeline.startDate || new Date();
        let endDate: Date = state.timeline.endDate || new Date();
        let gridWidth: number = rect.width - state.aside.asideWidth;

        SchedulerState.dispatch(SchedulerActions.schedulerWidthChanged(
            rect.width,
            gridWidth,
            TimelineService.calculateTimeline(
                startDate,
                endDate,
                startDate,
                endDate,
                gridWidth
            )
        ));

        window.addEventListener('resize', this.bindedHandleResize);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.bindedHandleResize);
    }

    private handleResize(e: Event) {
        let rect = this.ref.getBoundingClientRect();
        let state: ISchedulerState = SchedulerState.getState();
        let timeline = state.timeline;
        let gridWidth = rect.width - state.aside.asideWidth;

        SchedulerState.dispatch(SchedulerActions.schedulerWidthChanged(
            rect.width,
            gridWidth,
            TimelineService.calculateTimeline(
                timeline.startDate,
                timeline.endDate,
                timeline.zoomStartDate,
                timeline.zoomEndDate,
                gridWidth
            )
        ));
    }

    public render() {
        let style = {
            marginLeft: 200
        };

        return (
            <div className='scheduler' ref={(ref) => this.ref = ref}>
                <Aside />
                <div className='grid' style={style}>
                    <Timeline />
                    <Grid />
                </div>
            </div>
        );
    }
}

if (process.env.NODE_ENV !== 'test') {
    (function (requireContext) {
        return requireContext.keys().map(requireContext);
    } ((require as any).context('./', true, /\.less$/)));
}