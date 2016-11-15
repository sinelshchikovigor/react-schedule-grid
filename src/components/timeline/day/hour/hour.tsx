import * as React from 'react';

interface IHourProps {
    hour: string;
    position: number;
    width: number;
}

export class Hour extends React.Component<IHourProps, void> {
    public render() {
        let styles = {
            width: this.props.width + 'px',
            left: this.props.position + 'px'
        };

        return (
            <li className='hour' style={styles} key={this.props.hour}>
                {this.props.hour}
            </li>
        );
    }
}