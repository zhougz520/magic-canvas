import * as React from 'react';
import './bar.css';
import { Button, Input } from 'antd';

export interface IPropertyProps {
    collapsed: boolean;
    titleBarCollapsed: boolean;
    onPropsBarCollapse: (collapsed: boolean) => void;
}

export interface IPropertyState {
    showProps: boolean;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Property extends React.PureComponent<IPropertyProps, IPropertyState> {
    constructor(props: IPropertyProps) {
        super(props);
        this.state = {
            showProps: true
        };
    }

    render() {
        const { collapsed, titleBarCollapsed } = this.props;
        const { showProps } = this.state;

        const bar = (
            <div className="bar">
                <div className="panel">
                    <div className={`props${showProps ? ' active' : ''}`}>
                        {showProps ? 'props-bar' : ''}
                        <br />
                        <Button type="primary" size="small">DemoClick</Button>
                        <Input placeholder="Basic usage" />
                    </div>
                </div>
            </div>
        );

        return (
            <React.Fragment>
                <div
                    // tslint:disable-next-line:max-line-length
                    className={`props-bar${collapsed ? ' collapsed' : ''}${titleBarCollapsed ? ' title-bar-collapsed' : ''}${showProps ? ' props-bar-show' : ' props-bar-hide'}`}
                >
                    <div className="holder">
                        <div onClick={this.onClick}>折叠</div>
                    </div>
                    {collapsed ? '' : bar}
                </div>
            </React.Fragment>
        );
    }

    showProps = () => {
        this.collapse(false);
        this.setState({
            showProps: true
        });
    }

    onClick = () => {
        this.collapse(!this.props.collapsed);
    }

    collapse = (collapsed: boolean) => {
        this.props.onPropsBarCollapse(collapsed);
    }
}
