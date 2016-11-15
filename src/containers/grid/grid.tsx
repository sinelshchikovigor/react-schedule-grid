import * as React from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';

import { RowModel, TimelineModel, EntityModel, GroupModel } from '../../model';
import { Group, ENTITY_HEIGHT } from '../../components';
import { ISchedulerState, SchedulerState, SortOrder } from '../../scheduler.state';
import { SchedulerActions } from '../../scheduler.actions';
import { TimelineService } from '../../services';

interface IGridProps {
    groups: List<GroupModel>;
    scrollPosition: number;
    timeline: TimelineModel;
    now: Date;
    isTabularView: boolean;
    gridWidth: number;
    sortOrder: SortOrder;
    onEntityDoubleClick: (entity: EntityModel) => any;
    onEntityClick: (entity: EntityModel) => any;
    onEntityContextMenu: (entity: EntityModel) => any;
    virtualScroll: number;
}

export const VIRTUAL_SCROLL_TOP_BUFFER_COUNT = 50;
export const VIRTUAL_SCROLL_BOTTOM_BUFFER_COUNT = 50;
// TODO: Add to state
export const SCHEDULER_HEIGHT = 1080;

const synchronizeScrollPositions: any = TimelineService.await((scrollTop, scrollLeft) => {
    SchedulerState.dispatch(SchedulerActions.virtualScrollChanged(
        scrollTop
    ));
}, 50);

export class GridComponent extends React.Component<IGridProps, void> {
    private ref: HTMLElement;

    public componentDidUpdate() {
        this.ref.scrollLeft = this.props.timeline.horizontalScrollPosition;
    }

    public render() {
        let rows: List<RowModel> = List<RowModel>([]);
        let groups: List<JSX.Element> = List<JSX.Element>([]);

        if (this.props.groups) {
            this.props.groups.forEach((group: GroupModel, index: number) => {
                rows = rows.concat(group.rows) as List<RowModel>;
            });

            let visibleRows: List<RowModel> = rows.filter((row: RowModel, index: number) => {
                let rowPosition: number = index * ENTITY_HEIGHT;
                let virstualScroll: number = this.props.virtualScroll;

                let fitsTop: boolean = rowPosition >= (virstualScroll - (ENTITY_HEIGHT * VIRTUAL_SCROLL_TOP_BUFFER_COUNT));
                let fitsBottom: boolean = rowPosition <= (virstualScroll + (ENTITY_HEIGHT * VIRTUAL_SCROLL_BOTTOM_BUFFER_COUNT + SCHEDULER_HEIGHT));

                return fitsBottom && fitsTop;
            }) as List<RowModel>;

            groups = this.props.groups.map((group: GroupModel, index: number) => {
                return (
                    <Group key={index}
                        group={group}
                        isAsideGroup={false}
                        onRowClick={(row: RowModel) => this.onRowClick(row)}
                        timeline={this.props.timeline}
                        visibleRows={visibleRows} />
                );
            }) as List<JSX.Element>;
        }

        let gridContentStyle = {
            width: this.props.gridWidth
        };

        let tableStyle = {
            width: this.props.timeline.fullWidth
        };

        return (
            <div id='grid' className='grid__content' ref={(ref) => this.ref = ref} onScroll={(e) => this.onScroll(e)} style={gridContentStyle}>
                <ul className='table' style={tableStyle}>
                    {groups}
                </ul>
            </div>
        );
    }

    private onScroll = (event) => {
        let scrollTop = event.target.scrollTop;
        let scrollLeft = event.target.scrollLeft;

        let $aside: Element = window.document.querySelector('#aside');
        $aside.scrollTop = scrollTop;

        let $days: Element = window.document.querySelector('#days');
        $days.scrollLeft = scrollLeft;

        synchronizeScrollPositions(scrollTop, scrollLeft);
    }

    private onRowClick = (row: RowModel) => {
        let selection = List<RowModel>([
            row
        ]);

        SchedulerState.dispatch(SchedulerActions.selectionChange(selection));
    }
}

const mapStateToProps = (state: ISchedulerState) => {
    return {
        scrollPosition: state.scheduler.scrollTop,
        groups: state.scheduler.groups,
        timeline: state.timeline,
        now: state.scheduler.now,
        isTabularView: state.scheduler.isTabularView,
        gridWidth: state.grid.gridWidth,
        sortOrder: state.scheduler.sortOrder,
        virtualScroll: state.scheduler.virtualScroll
    };
};

const mapDispatchToProps = (dispatch) => ({
    onEntityClick: (entity: EntityModel) => {
        // TODO: Add groups
        // let state: ISchedulerState = SchedulerState.getState();
        // let selection: List<RowModel> = List<RowModel>();
        // let groups: List<RowModel> = state.groups;
        // let selectedRow: RowModel = rows.find((row: RowModel) => {
        //     return row.subject.id === entity.subjectId;
        // });

        // selection = selection.push(selectedRow);

        // dispatch(SchedulerActions.entityClick(entity));
        // dispatch(SchedulerActions.selectionChange(selection));
    },
    onEntityDoubleClick: (entity: EntityModel) => {
        dispatch(SchedulerActions.entityDoubleClick(entity));
    },
    onEntityContextMenu: (entity: EntityModel) => {
        dispatch(SchedulerActions.entityContextMenu(entity));
    }
});

export const Grid = connect(mapStateToProps, mapDispatchToProps)(GridComponent);