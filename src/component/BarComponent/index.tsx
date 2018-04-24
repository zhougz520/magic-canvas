import * as React from 'react';
import Title from './TitleBar';
import Command, { ICommandComponent } from './CommandBar';
import Resource from './ResourceBar';
import Property, { IPropertyComponent } from './PropertyBar';
import Contributor from './ContributorBar';
import { ComponentProperty } from '../config';

export interface IBarProps {
    changeStageOffset: (titleBarCollapsed: boolean, resourceBarCollapsed: boolean, propsBarCollapsed: boolean) => void;
    onFireCommand: (cId: string, cProperty: {pName: string, pValue: any, pType: string}) => void;
    onCommandProperties: (currentCid: string) => ComponentProperty |undefined;
    onPropertyProperties: (currentCid: string) =>  ComponentProperty| undefined;
    // onPropertyProperties: ComponentProperty| undefined;

    onFireProperties: (cId: string, pProperties: {pName: string, pValue: any, pType: string}) => void;
    // onSelectedCid: string;

}

export interface IBarState {
    titleBarCollapsed: boolean;
    resourceBarCollapsed: boolean;
    propsBarCollapsed: boolean;
    mapMenuType: string;    // mapStage左侧列表展示分类
    componentMode: string;  // 组件模式
}

export interface IBarListComponent {
    setPropertyState: (cId: string, properties: Array<{pName: string, pValue: any, pType: string}>) => void;
    setCommandState: (cId: string, properties: Array<{pName: string, pValue: any, pType: string}>) => void;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class BarList<P extends IBarProps, S extends IBarState>
                    extends React.PureComponent<P, S> implements IBarListComponent {
    private propertyTool: IPropertyComponent | null = null;
    private commandTool: ICommandComponent | null = null;

    constructor(props: any) {
        super(props);
        this.state = {
            titleBarCollapsed: false,
            resourceBarCollapsed: false,
            propsBarCollapsed: false,
            mapMenuType: 'defaultType',
            componentMode: 'page'
        } as Readonly<S>;
    }

    render() {
        const { titleBarCollapsed, resourceBarCollapsed, propsBarCollapsed, mapMenuType, componentMode } = this.state;

        return (
            <React.Fragment>
                <Title ref="title" collapsed={titleBarCollapsed} />
                <Command
                    ref={(render) => this.commandTool = render}
                    titleBarCollapsed={titleBarCollapsed}
                    onFireCommand={this.props.onFireCommand}
                    onCommandProperties={this.props.onCommandProperties}
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
                <Property
                    ref={(render) => this.propertyTool = render}
                    collapsed={propsBarCollapsed}
                    titleBarCollapsed={titleBarCollapsed}
                    // tslint:disable-next-line:jsx-no-lambda
                    onPropsBarCollapse={(collapsed) => this.collapseBar(undefined, undefined, collapsed)}
                    // onSelectedCid={this.props.onSelectedCid}
                    onPropertyProperties={this.props.onPropertyProperties}
                    onFireProperties={this.props.onFireProperties}
                />
                <Contributor />
            </React.Fragment>
        );
    }

    /*折叠面板*/
    // tslint:disable-next-line:max-line-length
    collapseBar = (tc: boolean | undefined = undefined, rc: boolean | undefined = undefined, pc: boolean | undefined = undefined) => {
        let { titleBarCollapsed, resourceBarCollapsed, propsBarCollapsed } = this.state;
        if (tc !== undefined) titleBarCollapsed = tc;
        if (rc !== undefined) resourceBarCollapsed = rc;
        if (pc !== undefined) propsBarCollapsed = pc;
        this.setState({ titleBarCollapsed, resourceBarCollapsed, propsBarCollapsed });
        this.props.changeStageOffset(titleBarCollapsed, resourceBarCollapsed, propsBarCollapsed);
    }

    setPropertyState = (cId: string, properties: Array<{pName: string, pValue: any, pType: string}>) => {
        if (this.propertyTool) {
            this.propertyTool.setPropertyState(cId, properties);
        }

    }

    setCommandState = (cId: string, properties: Array<{pName: string, pValue: any, pType: string}>) => {
        if (this.commandTool) {
            this.commandTool.setCommandState(cId, properties);
        }
    }
}
