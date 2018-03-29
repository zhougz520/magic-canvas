import * as React from 'react';
import './bar.css';

export interface IResourceProps {
    collapsed: boolean;
    titleBarCollapsed: boolean;
    onResourceBarCollapse: (collapsed: boolean) => void;
}

export interface IResourceState {
    showPages: boolean;
    showComponents: boolean;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class Resource extends React.PureComponent<IResourceProps, IResourceState> {
    constructor(props: IResourceProps) {
        super(props);
        this.state = {
            showPages: true,
            showComponents: false
        };
    }

    render() {
        const { collapsed, titleBarCollapsed } = this.props;

        const bar = (<div className="bar">resource-bar</div>);

        return (
            <React.Fragment>
                <div
                    // tslint:disable-next-line:max-line-length
                    className={`resource-bar${collapsed ? ' collapsed' : ''}${titleBarCollapsed ? ' title-bar-collapsed' : ''}`}
                >
                    <div className="holder">
                        <div onClick={this.showPages}>折叠</div>
                    </div>
                    {collapsed ? '' : bar}
                </div>
            </React.Fragment>
        );
    }

    showPages = () => {
        if (this.state.showPages && (!this.props.collapsed)) {
            this.collapse(true);

            return;
        }
        this.collapse(false);
        this.setState({
            showPages: true,
            showComponents: false
        });
    }

    collapse = (collapsed: boolean) => {
        this.props.onResourceBarCollapse(collapsed);
    }
}
