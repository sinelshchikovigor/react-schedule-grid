import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { List } from 'immutable';
import { Provider } from 'react-redux';

import { SchedulerState, ISchedulerState } from './scheduler.state';
import { Scheduler } from './scheduler';
import { SubjectModel, EntityModel, RowModel, TimelineModel, GroupModel } from './model';
import { ConverterService, TimelineService } from './services';
import { SchedulerActions } from './scheduler.actions';
import { TimelineActions } from './containers/timeline/timeline.actions';

let editorContent;

if (process.env.loadFakeData) {
    editorContent = require('./dummy.content.json');
}

export interface IScheduleListeners {
    onEntityDoubleClick?: (entity: EntityModel) => void;
    onEntityClick?: (entity: EntityModel) => void;
    onSelectionChange?: (data: List<RowModel>) => void;
    onEntityContextMenu?: (entity: EntityModel) => void;
}

export class SchedulerWrapper {
    // TODO Add configuration
    static initialize(elementId: string, config?: any) {
        let listeners: IScheduleListeners = config && config.listeners;
        listeners = listeners || {};

        SchedulerState.dispatch(SchedulerActions.listenersInitialized(listeners));

        ReactDOM.render((
            <Provider store={SchedulerState}>
                <Scheduler />
            </Provider>
        ), document.getElementById(elementId));

        if (process.env.loadFakeData) {
            SchedulerWrapper.setDateRange(new Date(2016, 9, 1), new Date(2016, 9, 15));
            SchedulerWrapper.loadData(editorContent);
        }
    }

    static loadData(content: any) {
        let subjectsRaw: Array<any> = content.subjects;
        let entitiesRaw: Array<any> = content.entities;
        let subjects: List<SubjectModel> = ConverterService.wrapSubjects(subjectsRaw);
        let entities: List<EntityModel> = ConverterService.wrapEntities(entitiesRaw);
        let groups: List<GroupModel> = ConverterService.createGroups(subjects, entities);

        SchedulerState.dispatch(SchedulerActions.dataChanged({
            subjects,
            entities,
            groups
        }));
    }

    static switchTabularGantt() {
        let state: ISchedulerState = SchedulerState.getState();

        SchedulerState.dispatch(SchedulerActions.isTabularChanged(
            !state.scheduler.isTabularView
        ));
    }

    static setStartDate(date: Date) {
        let state: ISchedulerState = SchedulerState.getState();
        SchedulerWrapper.setDateRange(date, state.timeline.endDate);
    }

    static setEndDate(date: Date) {
        let state: ISchedulerState = SchedulerState.getState();
        SchedulerWrapper.setDateRange(state.timeline.startDate, date);
    }

    static setDateRange(startDate: Date, endDate: Date) {
        let state: ISchedulerState = SchedulerState.getState();
        let timeline: TimelineModel = TimelineService.calculateTimeline(
            startDate,
            endDate,
            startDate,
            endDate,
            state.aside.asideWidth
        );

        SchedulerState.dispatch(TimelineActions.timelineChanged(
            timeline
        ));
    }

    static loadEntities(entitiesRaw: Array<any>) {
        try {
            let state: ISchedulerState = SchedulerState.getState();
            let entities: List<EntityModel> = ConverterService.wrapEntities(entitiesRaw);
            let groups: List<GroupModel> = ConverterService.createGroups(state.scheduler.subjects, entities);

            SchedulerState.dispatch(SchedulerActions.entitiesChanged(
                entities
            ));

            SchedulerState.dispatch(SchedulerActions.groupsChanged(
                groups
            ));
        } catch (e) {
            throw new Error(e);
        }
    }

    static loadSubjects(subjectsRaw: Array<any>) {
        try {
            let state: ISchedulerState = SchedulerState.getState();
            let subjects: List<SubjectModel> = ConverterService.wrapSubjects(subjectsRaw);
            let groups: List<GroupModel> = ConverterService.createGroups(subjects, state.scheduler.entities);

            SchedulerState.dispatch(SchedulerActions.subjectsChanged(
                subjects
            ));

            SchedulerState.dispatch(SchedulerActions.groupsChanged(
                groups
            ));
        } catch (e) {
            throw new Error(e);
        }
    }
}

if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target, firstSource) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            let to = Object(target);
            for (let i = 1; i < arguments.length; i++) {
                let nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }

                let keysArray = Object.keys(Object(nextSource));
                let len = keysArray.length;
                for (let nextIndex = 0; nextIndex < len; nextIndex++) {
                    let nextKey = keysArray[nextIndex];
                    let desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}

(window as any).SchedulerWrapper = SchedulerWrapper;
if (process.env.standAlone) {
    SchedulerWrapper.initialize('app');
}