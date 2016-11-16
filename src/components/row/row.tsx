import * as React from 'react';
import { List } from 'immutable';
import * as classnames from 'classnames';

import { Shift } from '../grid/entity';
import { RowModel, EntityModel, TimelineModel } from '../../model';
import { TimelineService } from '../../services';

interface IRowProps {
    row: RowModel;
    isTabularView: boolean;
    timeline: TimelineModel;
    onEntityDoubleClick?: (entity: EntityModel) => any;
    onEntityClick?: (entity: EntityModel) => any;
    onEntityContextMenu?: (entity: EntityModel) => any;
    onRowClick: (row: RowModel) => any;
    isAsideRow: boolean;
    isEntitiesVisible: boolean;
    isGroupRow: boolean;
}

export class Row extends React.Component<IRowProps, void> {
    public shouldComponentUpdate(nextProps: IRowProps) {
        return (
            !this.props.row.equalsTo(nextProps.row))
            || this.props.timeline !== nextProps.timeline
            || this.props.isTabularView !== nextProps.isTabularView
            || this.props.isEntitiesVisible !== nextProps.isEntitiesVisible;
    }

    public render() {
        let result: JSX.Element;

        if (this.props.isAsideRow) {
            if (this.props.isGroupRow) {
                result = this.getAsideGroupTemplate();
            } else {
                result = this.getAsideRowTemplate();
            }
        } else {
            result = this.getGridRowTemplate();
        }

        return result;
    }

    private getAsideRowTemplate(): JSX.Element {
        let className = classnames({
            'aside__row': true,
            'aside__row--selected': this.props.row.isSelected
        });

        return (
            <li onClick={this.onRowClick.bind(this)} className={className}>
                {this.props.row.subject.name}
            </li>
        );
    }

    private getAsideGroupTemplate(): JSX.Element {
        let className = classnames({
            'aside__row': true,
            'aside__row--selected': this.props.row.isSelected
        });

        return (
            <li onClick={this.onRowClick.bind(this)} className={className}>
                {this.props.row.subject.name}
            </li>
        );
    }

    private getGridRowTemplate(): JSX.Element {
        let entities: List<JSX.Element> = List<JSX.Element>([]);

        if (this.props.isEntitiesVisible) {
            let timeline = this.props.timeline;
            let periodEntities = this.props.row.entities.filter((entity) => {
                return TimelineService.isEntityInPeriod(entity, timeline);
            }) as List<EntityModel>;

            entities = periodEntities.map((entity) => {
                let geometry = TimelineService.calculateEntityGeometry(entity, this.props.isTabularView, timeline);

                return <Shift key={entity.id}
                    onEntityDoubleClick={(entity) => this.props.onEntityDoubleClick(entity)}
                    onEntityClick={(entity) => this.props.onEntityClick(entity)}
                    onEntityContextMenu={(entity) => this.props.onEntityContextMenu(entity)}
                    position={geometry.left}
                    width={geometry.width}
                    entity={entity}
                    isTabularView={this.props.isTabularView} />;
            }) as List<JSX.Element>;
        }

        let className = classnames({
            'grid__row': true,
            'grid__row--selected': this.props.row.isSelected
        });

        return (
            <li onClick={this.onRowClick.bind(this)} className={className}>
                {entities}
            </li>
        );
    }

    private onRowClick(e: React.MouseEvent<any>) {
        this.props.onRowClick(this.props.row);
    }
}
