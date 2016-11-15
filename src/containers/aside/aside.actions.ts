export enum AsideActionsConstants {
    'ASIDE_WIDTH_CHANGED'
}

export abstract class AsideActions {
    public static asideWidthChanged = (data: number) => {
        return {
            type: AsideActionsConstants.ASIDE_WIDTH_CHANGED,
            data: data
        };
    }
}