import React from "react";
import './well.scss'
export class WellContainer extends React.Component<{
    onClick?: () => void;
    rockCount: number;
}> {
    render() {
        return <div className="WellComponent" onClick={this.props.onClick}>
            {this.props.rockCount}
        </div>
    }
}