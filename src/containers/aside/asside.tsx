import * as React from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import * as classNames from 'classnames';

import { RowModel, GroupModel } from '../../model';
import { ISchedulerState, SortOrder } from '../../scheduler.state';
import { SchedulerActions }  from '../../scheduler.actions';
import { Group } from '../../components';

interface IAsideProps {
    groups: List<GroupModel>;
    scrollPosition: number;
    width: number;
    sortOrder: SortOrder;
    onHeaderClick: () => any;
}

class AsideComponent extends React.Component<IAsideProps, void> {
    public render() {
        let groups: List<JSX.Element> = List<JSX.Element>();

        if (this.props.groups) {
            groups = this.props.groups.map((group: GroupModel, index: number) => {
                return (
                    <Group key={index}
                        group={group}
                        isAsideGroup={true}
                        onRowClick={(row: RowModel) => this.onRowClick(row)} />
                );
            }) as List<JSX.Element>;
        }

        let style = {
            width: this.props.width || 0
        };

        let headerTextClass = classNames({
            'aside__header-text': true,
            'aside__header-text-sort': this.props.sortOrder !== SortOrder.None,
            'aside__header-text-sort-asc': this.props.sortOrder === SortOrder.Asc,
            'aside__header-text-sort-desc': this.props.sortOrder === SortOrder.Desc
        });

        return (
            <div className='aside' style={style}>
                <div className='aside__title' style={style}></div>
                <div className='aside__header' style={style} onClick={this.props.onHeaderClick}>
                    <span className={headerTextClass}>Title</span>
                </div>
                <div id='aside' className='aside__wrapper' style={style}>
                    <ul className='table'>
                        {groups}
                    </ul>
                </div>
            </div>
        );
    }

    private onRowClick(row: RowModel) { }
}

const mapStateToProps = (state: ISchedulerState) => {
    return {
        scrollPosition: state.scheduler.scrollTop,
        groups: state.scheduler.groups,
        width: state.aside.asideWidth,
        sortOrder: state.scheduler.sortOrder
    };
};

const mapDispatchToProps = (dispatch) => ({
    onHeaderClick: () => dispatch(SchedulerActions.sortByTitle())
});

export const Aside = connect(mapStateToProps, mapDispatchToProps)(AsideComponent);