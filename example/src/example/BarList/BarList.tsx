import * as React from 'react';
import { IPropertyGroup, IToolButtonGroup } from '../../../../src';

import { TitleBar } from './TitleBar';
import { ToolBar, IToolbarComponent } from './ToolBar';
import { PropertyBar, IPropertyComponent } from './PropertyBar';
import { ContributorBar } from './ContributorBar';
import Resource from './ResourceBar';

import { OrderedSet } from 'immutable';

export interface IBarProps {
    changeStageOffset: (leftCollapsed: boolean, rightCollapsed: boolean) => void;
    onCommandEmitted: (cmd: any) => void;
    getSaveData: () => void;
    setScale: (scale: number) => void;
}

export interface IBarState {
    titleBarCollapsed: boolean;
    resourceBarCollapsed: boolean;
    propsBarCollapsed: boolean;
    mapMenuType: string;    // mapStage左侧列表展示分类
    componentMode: string;  // 组件模式
}

export interface IBarListComponent {
    setPropertyState: (propertyGroup: OrderedSet<IPropertyGroup>) => void;
    setCommandState: (buttonGroup: IToolButtonGroup) => void;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export class BarList extends React.PureComponent<IBarProps, IBarState> implements IBarListComponent {
    private propertyTool: IPropertyComponent | null = null;
    private toolbar: IToolbarComponent | null = null;

    constructor(props: any) {
        super(props);
        this.state = {
            titleBarCollapsed: false,
            resourceBarCollapsed: false,
            propsBarCollapsed: false,
            mapMenuType: 'defaultType',
            componentMode: 'page'
        };
    }

    render() {
        const { titleBarCollapsed, resourceBarCollapsed, propsBarCollapsed, mapMenuType, componentMode } = this.state;

        return (
            <React.Fragment>
                <TitleBar ref="title" collapsed={titleBarCollapsed} />
                <ToolBar
                    ref={(render) => this.toolbar = render}
                    titleBarCollapsed={titleBarCollapsed}
                    onCommandEmitted={this.props.onCommandEmitted}
                    // tslint:disable-next-line:jsx-no-lambda
                    onTitleBarCollapse={(collapsed) => this.collapseBar(collapsed)}
                    getSaveData={this.props.getSaveData}
                    setScale={this.props.setScale}
                />
                <Resource
                    collapsed={resourceBarCollapsed}
                    titleBarCollapsed={titleBarCollapsed}
                    mapMenuType={mapMenuType}
                    componentMode={componentMode}
                    // tslint:disable-next-line:jsx-no-lambda
                    onResourceBarCollapse={(collapsed) => this.collapseBar(undefined, collapsed)}
                />
                <PropertyBar
                    ref={(render) => this.propertyTool = render}
                    collapsed={propsBarCollapsed}
                    titleBarCollapsed={titleBarCollapsed}
                    onCommandEmitted={this.props.onCommandEmitted}
                    // tslint:disable-next-line:jsx-no-lambda
                    onPropsBarCollapse={(collapsed) => this.collapseBar(undefined, undefined, collapsed)}
                // objectlist={this.props.objectlist}
                />
                <ContributorBar />
            </React.Fragment>
        );
    }

    /*折叠面板*/
    collapseBar = (tc: boolean | undefined = undefined, rc: boolean | undefined = undefined, pc: boolean | undefined = undefined) => {
        let { titleBarCollapsed, resourceBarCollapsed, propsBarCollapsed } = this.state;
        if (tc !== undefined) titleBarCollapsed = tc;
        if (rc !== undefined) resourceBarCollapsed = rc;
        if (pc !== undefined) propsBarCollapsed = pc;
        this.setState({ titleBarCollapsed, resourceBarCollapsed, propsBarCollapsed });
        this.props.changeStageOffset(resourceBarCollapsed, propsBarCollapsed);
    }

    setPropertyState = (propertyGroup: OrderedSet<IPropertyGroup>) => {
        if (this.propertyTool) {
            this.propertyTool.setPropertyState(propertyGroup);
        }

    }

    setCommandState = (buttonGroup: IToolButtonGroup): void => {
        if (this.toolbar) {
            this.toolbar.setCommandState(buttonGroup);
        }
    }
}
