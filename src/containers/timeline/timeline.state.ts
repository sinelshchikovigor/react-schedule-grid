import { TimelineModel } from '../../model';
import { DateTimeService } from '../../services';
import { TimelineActionsConstants } from './timeline.actions';

const initialState: TimelineModel = new TimelineModel(
    new Date(2016, 9, 1),
    DateTimeService.addSeconds(new Date(2016, 9, 15), -1),
    new Date(2016, 9, 1),
    DateTimeService.addSeconds(new Date(2016, 9, 15), -1),
    0,
    0,
    0,
    0
);

export const TimelineState = (state: TimelineModel = initialState, action) => {
    switch (action.type) {
        case TimelineActionsConstants[TimelineActionsConstants.TIMELINE_CHANGED]:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};