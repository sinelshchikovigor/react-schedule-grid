import { List } from 'immutable';
import { SubjectModel, RowModel, EntityModel, TimelineModel, GroupModel } from './model';
import { IScheduleListeners } from './scheduler.wrapper';

export enum SchedulerActionsConstants {
    'DATA_CHANGED',
    'SUBJECT_CHANGED',
    'GROUPS_CHANGED',
    'ENTITY_CHANGED',
    'SCROLL_POSITION_CHANGED',
    'IS_TABULAR_CHANGED',
    'SCHEDULER_WIDTH_CHANGED',
    'LISTENERS_INITIALIZED',
    'SORT_BY_TITLE',
    'ENTITY_CLICK',
    'ENTITY_DOUBLE_CLICK',
    'ENTITY_CONTEXT_MENU',
    'SELECTION_CHANGE',
    'VIRTUAL_SCROLL_CHANGED'
}

type IData = {
    subjects: List<SubjectModel>;
    entities: List<EntityModel>;
    groups: List<GroupModel>;
}

export abstract class SchedulerActions {
    public static dataChanged = (data: IData) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.DATA_CHANGED],
            data: data
        };
    };

    public static subjectsChanged = (data: List<SubjectModel>) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.SUBJECT_CHANGED],
            data: data
        };
    };

    public static entitiesChanged = (data: List<EntityModel>) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.ENTITY_CHANGED],
            data: data
        };
    };

    public static groupsChanged = (data: List<GroupModel>) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.GROUPS_CHANGED],
            data: data
        };
    };

    public static isTabularChanged = (data: boolean) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.IS_TABULAR_CHANGED],
            data: data
        };
    };

    public static schedulerWidthChanged = (schedulerWidth: number, gridWidth: number, timeline: TimelineModel) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.SCHEDULER_WIDTH_CHANGED],
            data: {
                schedulerWidth: schedulerWidth,
                timeline: timeline,
                gridWidth: gridWidth
            }
        };
    };

    public static listenersInitialized = (data: IScheduleListeners) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.LISTENERS_INITIALIZED],
            data: data
        };
    };

    public static entityDoubleClick = (data: EntityModel) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.ENTITY_DOUBLE_CLICK],
            data: data
        };
    };

    public static entityClick = (data: EntityModel) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.ENTITY_CLICK],
            data: data
        };
    };

    public static entityContextMenu = (data: EntityModel) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.ENTITY_CONTEXT_MENU],
            data: data
        };
    };

    public static selectionChange = (data: List<RowModel>) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.SELECTION_CHANGE],
            data: data
        };
    };

    public static sortByTitle = () => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.SORT_BY_TITLE]
        };
    };

    public static virtualScrollChanged = (data: number) => {
        return {
            type: SchedulerActionsConstants[SchedulerActionsConstants.VIRTUAL_SCROLL_CHANGED],
            data: data
        };
    };
}

