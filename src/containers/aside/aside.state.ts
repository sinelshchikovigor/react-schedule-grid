export interface IAsideState {
    asideWidth: number;
}

const initialState = {
    asideWidth: 200
};

export const AsideState = (state: IAsideState = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};