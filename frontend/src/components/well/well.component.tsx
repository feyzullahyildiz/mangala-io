import React from "react";
import './well.scss'
interface Props {
    onClick?: () => void;
    rockCount: number;
    disabled: boolean;
    rival: boolean;
}
export class WellContainer extends React.Component<Props, { splashing: boolean }> {
    timeoutId: any;
    constructor(props: any) {
        super(props)
        this.state = {
            splashing: false
        }
    }
    componentWillReceiveProps(newProps: Props) {
        if (newProps.rockCount !== this.props.rockCount) {
            console.log('SAYI FARKLI')
            this.startSplashing()
        }
    }
    startSplashing() {
        clearTimeout(this.timeoutId);
        this.setState({ splashing: true })
        this.timeoutId = setTimeout(() => {
            this.setState({ splashing: false })
        }, 500)
    }
    render() {
        const { rockCount, disabled, rival } = this.props;
        const rivalCssClass = rival ? 'rival' : 'me';
        const splashCssClass = this.state.splashing ? 'splash' : '';
        const disabledCssClass = (rockCount === 0 || disabled) ? 'disabled' : 'allowed';
        const classNames = `WellComponent ${rivalCssClass} ${disabledCssClass} ${splashCssClass}`;
        return <div className={classNames}
            onClick={this.props.onClick}>
            {this.props.rockCount}
        </div>
    }
}