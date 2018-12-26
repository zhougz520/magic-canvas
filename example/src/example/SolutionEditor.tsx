import * as React from 'react';

import { BarList, IBarListComponent } from './BarList';
import { Stage, ComponentsType, IPropertyGroup, IToolButtonGroup } from '../../../src';
import './solution.css';
import { config } from './config';
import { OrderedSet } from 'immutable';

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class SolutionEditor extends React.PureComponent<any, any> {
    private stage: Stage | null = null;
    private barList: IBarListComponent | null = null;

    constructor(props: any) {
        super(props);

        this.state = {
            scale: 1
        };
    }

    getStage = (): Stage => {
        return (this.stage as Stage);
    }

    // 修改画布的偏移量
    changeStageOffset = (resourceBarCollapsed: boolean, propsBarCollapsed: boolean) => {
        this.getStage().changeStageOffset(resourceBarCollapsed, propsBarCollapsed);
    }

    // 获取命令，并传给canvas
    onCommandEmitted = (cmd: any) => {
        this.getStage().onCommandEmitted(cmd);
    }

    // 获取选中的组件集合并传给CommandBar
    onCommandProperties = (buttonGroup: IToolButtonGroup): void => {
        if (this.barList) {
            this.barList.setCommandState(buttonGroup);
        }
    }

    // 将输入参数：编辑中的组件属性，传给propertyTool
    onPropertyProperties = (propertyGroup: OrderedSet<IPropertyGroup>): void => {
        if (this.barList) {
            this.barList.setPropertyState(propertyGroup);
        }
    }

    getSaveData = () => {
        const saveData = this.getStage().getCanvasSaveData();
        console.log(JSON.stringify(saveData));
    }

    setScale = (scale: number) => {
        this.setState({
            scale
        });
    }

    render() {
        return (
            <div className="main-editor">
                <BarList
                    ref={(render) => this.barList = render}
                    changeStageOffset={this.changeStageOffset}
                    onCommandEmitted={this.onCommandEmitted}
                    getSaveData={this.getSaveData}
                    setScale={this.setScale}
                />
                <Stage
                    config={config}
                    ref={(render) => this.stage = render}
                    components={detail.content.components as ComponentsType}
                    canvasSize={{ width: 2560, height: 1440 }}
                    onCommandProperties={this.onCommandProperties}
                    onPropertyProperties={this.onPropertyProperties}
                    pageMode={'Edit'}
                    userInfo={{ userId: 'zhougz@mingyuanyun.com', userName: '周冠舟' }}
                    scale={this.state.scale}
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
