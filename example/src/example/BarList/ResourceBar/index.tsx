import * as React from 'react';
import { Icon } from 'antd';
import ComponentList from './ComponentList';
import './resource.css';

export interface IResourceProps {
    collapsed: boolean;
    titleBarCollapsed: boolean;
    mapMenuType: string;
    componentMode: string;
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
        const { collapsed, titleBarCollapsed, mapMenuType, componentMode } = this.props;

        const bar = (
            <div className="bar" style={{ overflowY: 'auto' }}>
                <div className="panel">
                    <div className="components active">
                        <ComponentList mapMenuType={mapMenuType} componentMode={componentMode} />
                    </div>
                </div>
            </div>
        );

        return (
            <React.Fragment>
                <div
                    className={`resource-bar${collapsed ? ' collapsed' : ''}${titleBarCollapsed ? ' title-bar-collapsed' : ''}`}
                    style={{ zIndex: 10 }}
                >
                    <div className="holder">
                        <div onClick={this.showPages}><Icon type="panel-component" />组件</div>
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
