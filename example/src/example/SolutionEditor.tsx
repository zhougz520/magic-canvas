import * as React from 'react';

import { BarList, IBarListComponent } from './BarList';
import { Stage, ComponentsType, ICompos } from '../../../src';
import './solution.css';
import { config } from './config';
import { detail1, detail2 } from './data';
import { Map, List } from 'immutable';

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
    private barList: IBarListComponent | null = null;

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
    changeStageOffset = (resourceBarCollapsed: boolean, propsBarCollapsed: boolean) => {
        this.getStage().changeStageOffset(resourceBarCollapsed, propsBarCollapsed);
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
    onPropertyProperties = (compProperty: Array<{ pTitle: string, pKey: string, pValue: any, pType: string }> | undefined
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

    getSaveData = () => {
        const saveData = this.getStage().getCanvasSaveData();
        console.log(JSON.stringify(saveData));
        const isDirty = this.getStage().getCanvasIsDirty();
        console.log(isDirty);
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
                    getSaveData={this.getSaveData}
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

export const detail = {
    content: {
        components: [
        ]
    },
    layout: { mode: 'free' }
};
