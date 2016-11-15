import * as React from 'react';

import { Entity, ENTITY_HEIGHT } from '../';
import { DateTimeService } from '../../../../services';

export class Shift extends Entity {
    public render() {
        return this.props.isTabularView ? this.getTabularTemplate() : this.getGanttTemplate();
    }

    getGanttTemplate(): JSX.Element {
        let startHours: string = DateTimeService.toHourAndMinutesString(this.props.entity.startDate);
        let endHours: string = DateTimeService.toHourAndMinutesString(this.props.entity.endDate);

        let styles = {
            left: this.props.position + 'px',
            width: this.props.width + 'px',
            height: ENTITY_HEIGHT + 'px'
        };

        return (
            <div className='shift shift--gantt'
                onDoubleClick={() => this.props.onEntityDoubleClick(this.props.entity)}
                onClick={() => this.props.onEntityClick(this.props.entity)}
                onContextMenu={this.onContextMenu.bind(this)}
                style={styles}>
                {startHours}-{endHours}
            </div>
        );
    }

    getTabularTemplate(): JSX.Element {
        let styles = {
            left: this.props.position + 'px',
            width: this.props.width + 'px'
        };

        return (
            <div className='shift shift--tabular'
                onDoubleClick={() => this.props.onEntityDoubleClick(this.props.entity)}
                onClick={() => this.props.onEntityClick(this.props.entity)}
                onContextMenu={this.onContextMenu.bind(this)}
                style={styles}>
                {this.props.entity.startDate.getHours()}- {this.props.entity.endDate.getHours()}
            </div>
        );
    }

    onContextMenu(e: React.MouseEvent) {
        e.preventDefault();
        this.props.onEntityContextMenu(this.props.entity);
    }
}