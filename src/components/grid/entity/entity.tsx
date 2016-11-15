import * as React from 'react';

import { EntityModel } from '../../../model';

interface IEntityProps {
    entity: EntityModel;
    position: number;
    width: number;
    isTabularView: boolean;
    onEntityDoubleClick: (entity: EntityModel) => any;
    onEntityClick: (entity: EntityModel) => any;
    onEntityContextMenu: (entity: EntityModel) => any;
}

export const ENTITY_HEIGHT: number = 24;

export abstract class Entity extends React.Component<IEntityProps, void> {
    public render() {
        return this.props.isTabularView ? this.getTabularTemplate() : this.getGanttTemplate();
    }

    abstract getGanttTemplate(): JSX.Element;
    abstract getTabularTemplate(): JSX.Element;
}