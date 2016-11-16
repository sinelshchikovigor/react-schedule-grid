import * as React from 'react';
import { List } from 'immutable';

import { RowModel, GroupModel, TimelineModel, SubjectModel, EntityModel } from '../../model';
import { Row } from '../../components';

interface IGroupProps {
    group: GroupModel;
    visibleRows?: List<RowModel>;
    timeline?: TimelineModel;
    onRowClick: (row: RowModel) => any;
    isAsideGroup: boolean;
}

export class Group extends React.Component<IGroupProps, void> {
    public render() {
        let rows: List<JSX.Element> = this.props.isAsideGroup ? this.getAsideGroupTemplate() : this.getGridGroupTemplate();
        
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
            onRowClick={(row: RowModel) => this.props.onRowClick(row)}
            isAsideRow={true}
            timeline={this.props.timeline}
            isEntitiesVisible={true}
            isTabularView={false} />

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
                    onRowClick={(row: RowModel) => this.props.onRowClick(row)}
                    isAsideRow={true}
                    timeline={this.props.timeline}
                    isEntitiesVisible={true}
                    isTabularView={false} />
            );
        }) as List<JSX.Element>;
    }

    private getGridGroupTemplate(): List<JSX.Element> {
        return this.props.group.rows.map((row: RowModel, index: number) => {
            let isEntitiesVisible: boolean = this.props.visibleRows.contains(row);

            return (
                <Row key={index}
                    row={row}
                    onRowClick={(row: RowModel) => this.props.onRowClick(row)}
                    isAsideRow={false}
                    timeline={this.props.timeline}
                    isEntitiesVisible={isEntitiesVisible}
                    isTabularView={false} />
            );

        }) as List<JSX.Element>;
    }
}
