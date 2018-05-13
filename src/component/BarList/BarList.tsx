import * as React from 'react';

import { TitleBar } from './TitleBar';
import { ToolBar, IToolbarComponent } from './ToolBar';
import { PropertyBar, IPropertyComponent } from './PropertyBar';
import { ContributorBar } from './ContributorBar';
import Resource from './ResourceBar';

import { Map } from 'immutable';

export interface IBarProps {
    changeStageOffset: (titleBarCollapsed: boolean, resourceBarCollapsed: boolean, propsBarCollapsed: boolean) => void;
    onCommandEmitted: (cmd: any) => void;
    onPropertyProperties: (compProperty: Array<{pTitle: string, pKey: string, pValue: any, pType: string}>) =>
        void;
    onFireProperties: (pKey: string, pValue: any) => void;
    // objectlist: string;
}

export interface IBarState {
    titleBarCollapsed: boolean;
    resourceBarCollapsed: boolean;
    propsBarCollapsed: boolean;
    mapMenuType: string;    // mapStage左侧列表展示分类
    componentMode: string;  // 组件模式
}

export interface IBarListComponent {
    setPropertyState: (properties: Array<{pTitle: string, pKey: string, pValue: any, pType: string}>) => void;
    setCommandState: (selectedComs: Map<string, any>) => void;
    clearPropertyState: () => void;
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
                    // tslint:disable-next-line:jsx-no-lambda
                    onPropsBarCollapse={(collapsed) => this.collapseBar(undefined, undefined, collapsed)}
                    onPropertyProperties={this.props.onPropertyProperties}
                    onFireProperties={this.props.onFireProperties}
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
        this.props.changeStageOffset(titleBarCollapsed, resourceBarCollapsed, propsBarCollapsed);
    }

    setPropertyState = (properties: Array<{pTitle: string, pKey: string, pValue: any, pType: string}>) => {
        if (this.propertyTool) {
            this.propertyTool.setPropertyState(properties);
        }

    }

    setCommandState = (selectedComs: Map<string, any>): void => {
        if (this.toolbar) {
            this.toolbar.setCommandState(selectedComs);
        }
    }

    clearPropertyState = (): void => {
        if (this.propertyTool) {
            this.propertyTool.clearPropertyState();
        }
    }
}
