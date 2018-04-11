import * as React from 'react';
import { Switch } from 'antd';
import { config } from '../config';
import './bar.css';

export interface ICommandProps {
    titleBarCollapsed: boolean;
    onTitleBarCollapse: (collapsed: boolean) => void;
}

export interface ICommandState {
    [key: string]: string;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Command<P extends ICommandProps, S extends ICommandState> extends React.PureComponent<P, S> {
    constructor(props: any) {
        super(props);
    }

    onClick = (e: any) => {
        this.props.onTitleBarCollapse(!this.props.titleBarCollapsed);
    }

    onChange = (e: boolean) => {
        config.highPerformance = e;
    }

    render() {
        const { titleBarCollapsed } = this.props;

        return (
            <React.Fragment>
                <div className={`command-bar ${titleBarCollapsed ? 'title-bar-collapsed' : ''}`}>
                    <div onClick={this.onClick}>折叠</div>
                    <div>
                        <span>高性能</span>
                        <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={this.onChange} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
