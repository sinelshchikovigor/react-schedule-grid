import * as React from 'react';
import { List } from 'immutable';

import { RowModel, GroupModel, TimelineModel, SubjectModel, EntityModel } from '../../model';
import { Row } from '../../components';

interface IGroupProps {
    group: GroupModel;
    visibleRows?: List<RowModel>;
    timeline?: TimelineModel;
    isAsideGroup: boolean;
    onGroupClick: (group: GroupModel) => void
}

export class Group extends React.Component<IGroupProps, void> {
    public render() {
        let rows: List<JSX.Element>;

        if (this.props.group.isCollapsed) {
            if (this.props.isAsideGroup) {
                rows = this.getAsideGroupTemplate()
            } else {
                rows = this.getGridGroupTemplate()
            }
        }

        let groupSubject: SubjectModel = new SubjectModel(
            this.props.group.id,
            this.props.group.title
        );

        let groupRow: RowModel = new RowModel(
            groupSubject,
            List<EntityModel>([]),
            false
        );

        let group = <Row key={groupRow.subject.id}
            row={groupRow}
            onRowClick={(row: RowModel) => this.props.onGroupClick(this.props.group)}
            isAsideRow={this.props.isAsideGroup}
            timeline={this.props.timeline}
            isEntitiesVisible={true}
            isTabularView={false}
            isGroupRow={true} />

        return (
            <div>
                {group}
                {rows}
            </div>
        );
    }

    private getAsideGroupTemplate(): List<JSX.Element> {
        return this.props.group.rows.map((row: RowModel, index: number) => {
            return (
                <Row key={index}
                    row={row}
                    onRowClick={(row: RowModel) => this.props.onGroupClick(this.props.group)}
                    isAsideRow={true}
                    timeline={this.props.timeline}
                    isEntitiesVisible={true}
                    isTabularView={false}
                    isGroupRow={true} />
            );
        }) as List<JSX.Element>;
    }

    private getGridGroupTemplate(): List<JSX.Element> {
        return this.props.group.rows.map((row: RowModel, index: number) => {
            let isEntitiesVisible: boolean = this.props.visibleRows.contains(row);

            return (
                <Row key={index}
                    row={row}
                    onRowClick={(row: RowModel) => { } }
                    isAsideRow={false}
                    timeline={this.props.timeline}
                    isEntitiesVisible={isEntitiesVisible}
                    isTabularView={false}
                    isGroupRow={true} />
            );

        }) as List<JSX.Element>;
    }
}
