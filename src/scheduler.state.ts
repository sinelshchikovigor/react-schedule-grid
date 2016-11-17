import { createStore, combineReducers } from 'redux';
import { List } from 'immutable';

import { SchedulerActionsConstants } from './scheduler.actions';
import { SubjectModel, EntityModel, GroupModel, TimelineModel } from './model';
import { IScheduleListeners } from './scheduler.wrapper';
import { AsideState, IAsideState, GridState, IGridState, TimelineState } from './containers';

export enum SortOrder {
    None,
    Asc,
    Desc
}

export interface ISchedulerState {
    aside: IAsideState;
    grid: IGridState;
    timeline: TimelineModel;
    scheduler: {
        groups?: List<GroupModel>;
        subjects?: List<SubjectModel>;
        entities?: List<EntityModel>;
        scrollTop?: number;
        schedulerWidth?: number;
        isTabularView?: boolean;
        listeners?: IScheduleListeners;
        sortOrder: SortOrder;
        now: Date;
        virtualScroll: number;
    };
}

const initialState = {
    sortOrder: SortOrder.None,
    now: new Date(),
    virtualScroll: 0,
    groups: List<GroupModel>([]),
    subjects: List<SubjectModel>([]),
    entities: List<EntityModel>([]),
    isTabularView: false,
    schedulerWidth: 700,
    listeners: []
};

const SchedulerStateReducer = (state: any = initialState, action) => {
    switch (action.type) {
        case SchedulerActionsConstants[SchedulerActionsConstants.DATA_CHANGED]:
            return Object.assign({}, state, {
                subjects: action.data.subjects,
                entities: action.data.entities,
                groups: action.data.groups
            });
        case SchedulerActionsConstants[SchedulerActionsConstants.SUBJECT_CHANGED]:
            return Object.assign({}, state, {
                subjects: action.data
            });
        case SchedulerActionsConstants[SchedulerActionsConstants.ENTITY_CHANGED]:
            return Object.assign({}, state, {
                entities: action.data
            });
        case SchedulerActionsConstants[SchedulerActionsConstants.GROUPS_CHANGED]:
            return Object.assign({}, state, {
                groups: action.data
            });
        case SchedulerActionsConstants[SchedulerActionsConstants.IS_TABULAR_CHANGED]:
            return Object.assign({}, state, {
                isTabularView: action.data
            });
        case SchedulerActionsConstants[SchedulerActionsConstants.SCHEDULER_WIDTH_CHANGED]:
            return Object.assign({}, state, {
                schedulerWidth: action.data.schedulerWidth,
                timeline: action.data.timeline
            });
        case SchedulerActionsConstants[SchedulerActionsConstants.LISTENERS_INITIALIZED]:
            return Object.assign({}, state, {
                listeners: action.data
            });
        case SchedulerActionsConstants[SchedulerActionsConstants.ENTITY_CLICK]:
            if (initialState.listeners && state.listeners.onEntityClick && typeof state.listeners.onEntityClick === 'function') {
                state.listeners.onEntityClick(action.data);
            }
            return state;
        case SchedulerActionsConstants[SchedulerActionsConstants.ENTITY_DOUBLE_CLICK]:
            if (state.listeners && state.listeners.onEntityDoubleClick && typeof state.listeners.onEntityDoubleClick === 'function') {
                state.listeners.onEntityDoubleClick(action.data);
            }
            return state;
        case SchedulerActionsConstants[SchedulerActionsConstants.ENTITY_CONTEXT_MENU]:
            if (state.listeners && state.listeners.onEntityContextMenu && typeof state.listeners.onEntityContextMenu === 'function') {
                state.listeners.onEntityContextMenu(action.data);
            }
            return state;
        case SchedulerActionsConstants[SchedulerActionsConstants.SELECTION_CHANGE]:
            // TODO: Change to groups
            // if (action.data && action.data.size > 0) {

            // let rows = state.rows;

            // // Unselect all selected rows
            // let selectedRows = rows
            //     .map((value: RowModel, key: number) => ({ value, key }))
            //     .filter((keyValuePair) => keyValuePair.value.isSelected);

            // selectedRows.forEach((keyValuePair) => {
            //     const value: RowModel = keyValuePair.value;
            //     rows = rows.set(keyValuePair.key, value.updateIsSelected(false));
            // });


            // // Perform selection
            // let rowsForSelection = rows
            //     .map((value: RowModel, key: number) => ({ value, key }))
            //     .filter((keyValuePair) => action.data.some((row) => row.subject.id === keyValuePair.value.subject.id));

            // rowsForSelection.forEach((keyValuePair: any) => {
            //     const value: RowModel = keyValuePair.value;
            //     rows = rows.set(keyValuePair.key, value.updateIsSelected(true));
            // });

            // if (state.listeners && state.listeners.onSelectionChange && typeof state.listeners.onSelectionChange === 'function') {
            //     state.listeners.onSelectionChange(action.data);
            // }

            // return Object.assign({}, state, {
            //     rows: rows
            // });
            // }
            return state;
        case SchedulerActionsConstants[SchedulerActionsConstants.SORT_BY_TITLE]:
            // TODO: Change to groups
            // const sortOrder = state.sortOrder === SortOrder.None || state.sortOrder === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc;

            // let sortedRows = state.rows.sort((valueA, valueB) => {
            //     if (sortOrder === SortOrder.Asc) {
            //         return SubjectService.compareSubjectsByTitleAsc(valueA.subject, valueB.subject);
            //     } else {
            //         return SubjectService.compareSubjectsByTitleDesc(valueA.subject, valueB.subject);
            //     }
            // });

            // return Object.assign({}, state, {
            //     sortOrder,
            //     rows: sortedRows
            // });
            return state;
        case SchedulerActionsConstants[SchedulerActionsConstants.VIRTUAL_SCROLL_CHANGED]:
            return Object.assign({}, state, {
                virtualScroll: action.data
            });

        case SchedulerActionsConstants[SchedulerActionsConstants.GROUPS_UPDATED]:
            let groups: List<GroupModel> = state.groups;
            let newGroups: List<GroupModel>;

            groups.forEach((group: GroupModel, key: number, groups: List<GroupModel>) => {
                action.data.forEach((updatedGroup: GroupModel) => {
                    if (group.id === updatedGroup.id) {
                        newGroups = groups.set(key, updatedGroup);
                    }
                });
            });

            return Object.assign({}, state, {
                groups: newGroups
            });
        default:
            return state;
    }
};

const combinedReducers = combineReducers({
    scheduler: SchedulerStateReducer,
    aside: AsideState,
    grid: GridState,
    timeline: TimelineState
});

export const SchedulerState = createStore(combinedReducers, (window as any).devToolsExtension && (window as any).devToolsExtension());