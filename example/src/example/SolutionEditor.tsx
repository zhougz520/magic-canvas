import * as React from 'react';

import { BarList, IBarListComponent } from './BarList';
import { Stage, ComponentsType, ICompos } from '../../../src';
import './solution.css';
import { config } from './config';
import { Map } from 'immutable';

export interface ISolutionProp {
    [key: string]: any;
}

export interface ISolutionState {
    compos: ICompos;
    canvasSize: { width: number, height: number };
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class SolutionEditor extends React.PureComponent<ISolutionProp, ISolutionState> {
    private stage: Stage | null = null;
    private barList: IBarListComponent |null = null;

    constructor(props: ISolutionProp) {
        super(props);
        this.state = {
            compos: config.componentPosition,
            canvasSize: config.canvasSize
        };
    }

    getStage = (): Stage => {
        return (this.stage as Stage);
    }

    // 修改画布的偏移量
    changeStageOffset = (titleBarCollapsed: boolean, resourceBarCollapsed: boolean, propsBarCollapsed: boolean) => {
        this.getStage().changeStageOffset(titleBarCollapsed, resourceBarCollapsed, propsBarCollapsed);
    }

    highPerformance = (value: boolean) => {
        this.getStage().changeHighPerformance(value);
    }

    // 获取命令，并传给canvas
    onCommandEmitted = (cmd: any) => {
        this.getStage().getCanvas().executeCommand(cmd);
    }

    // 获取选中的组件集合并传给CommandBar
    onCommandProperties = (selectedComs: Map<string, any>): void => {
        if (this.barList) {
            this.barList.setCommandState(selectedComs);
        }
    }

    // 将输入参数：编辑中的组件属性，传给propertyTool
    onPropertyProperties = (compProperty: Array<{pTitle: string, pKey: string, pValue: any, pType: string}> | undefined
            ): void => {
                if (this.barList && compProperty !== undefined) {
                    this.barList.setPropertyState(compProperty);
                }
    }

    // 将propertyTool的修改的属性传给canvas 设置对应的选中控件
    onFireProperties = (pKey: string, pValue: any) => {
        this.getStage().getCanvas().executeProperties(pKey, pValue);
    }

    // 清除属性工具栏状态
    clearSelectedProperty = () => {
        if (this.barList) {
            this.barList.clearPropertyState();
        }
    }

    render() {
        return (
            <div className="main-editor">
                <BarList
                    ref={(render) => this.barList = render}
                    changeStageOffset={this.changeStageOffset}
                    onCommandEmitted={this.onCommandEmitted}
                    onFireProperties={this.onFireProperties}
                    onPropertyProperties={this.onPropertyProperties}
                    highPerformance={this.highPerformance}
                    // objectlist={this.props.objectlist}
                />
                <Stage
                    config={config}
                    ref={(render) => this.stage = render}
                    components={detail.content.components as ComponentsType}
                    onCommandProperties={this.onCommandProperties}
                    onPropertyProperties={this.onPropertyProperties}
                    clearSelectedProperty={this.clearSelectedProperty}
                    pageMode={'Edit'}
                />
            </div>
        );
    }
}

const detail = {
    content: {
        components: []
    },
    layout: { mode: 'free' }
};
