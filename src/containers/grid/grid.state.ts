import { SchedulerActionsConstants } from '../../scheduler.actions';

export interface IGridState {
    gridWidth?: number;
    gridScrollBarWidth?: number;
}

const initialState = {
    gridWidth: 500,
    gridScrollBarWidth: 17
};

export const GridState = (state: IGridState = initialState, action) => {
    switch (action.type) {
        case SchedulerActionsConstants[SchedulerActionsConstants.SCHEDULER_WIDTH_CHANGED]:
            return Object.assign({}, state, {
                gridWidth: action.data.gridWidth
            });
        default:
            return state;
    }
};