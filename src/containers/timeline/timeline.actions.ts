import { TimelineModel } from '../../model';

export enum TimelineActionsConstants {
    'TIMELINE_CHANGED'
}

export abstract class TimelineActions {
    public static timelineChanged = (data: TimelineModel) => {
        return {
            type: TimelineActionsConstants[TimelineActionsConstants.TIMELINE_CHANGED],
            data: data
        };
    };

}