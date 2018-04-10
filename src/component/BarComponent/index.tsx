import * as React from 'react';
import Title from './TitleBar';
import Command from './CommandBar';
import Resource from './ResourceBar';
import Property from './PropertyBar';
import Contributor from './ContributorBar';

export interface IBarProps {
    changeStageOffset: (titleBarCollapsed: boolean, resourceBarCollapsed: boolean, propsBarCollapsed: boolean) => void;
}

export interface IBarState {
    titleBarCollapsed: boolean;
    resourceBarCollapsed: boolean;
    propsBarCollapsed: boolean;
    mapMenuType: string;    // mapStage左侧列表展示分类
    componentMode: string;  // 组件模式
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class BarList<P extends IBarProps, S extends IBarState> extends React.PureComponent<P, S> {
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
                    titleBarCollapsed={titleBarCollapsed}
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
                    collapsed={propsBarCollapsed}
                    titleBarCollapsed={titleBarCollapsed}
                    // tslint:disable-next-line:jsx-no-lambda
                    onPropsBarCollapse={(collapsed) => this.collapseBar(undefined, undefined, collapsed)}
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
}
