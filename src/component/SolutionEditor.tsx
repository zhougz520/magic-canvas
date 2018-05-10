import * as React from 'react';

import { BarList, IBarListComponent } from './BarComponent';
import Draw from './DrawComponent/draw';
import Canvas from './CanvasComponent/canvas';
import { IDrawComponent } from './DrawComponent';
import { ICanvasComponent, IBoundary } from './CanvasComponent/inedx';
import './solution.css';
import { ICompos, config } from './config';
import { IOffset } from './CanvasComponent/model/types';
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
    private canvas: ICanvasComponent | null = null;
    private draw: IDrawComponent | null = null;
    private stage: HTMLDivElement | null = null;
    private barList: IBarListComponent |null = null;

    constructor(props: ISolutionProp) {
        super(props);
        this.state = {
            compos: config.componentPosition,
            canvasSize: config.canvasSize
        };
    }

    getCanvas = () => {
        return this.canvas;
    }

    getDraw = () => {
        return this.draw;
    }

    // 修改画布的偏移量
    changeStageOffset = (titleBarCollapsed: boolean, resourceBarCollapsed: boolean, propsBarCollapsed: boolean) => {
        const newStageOffset = Object.assign({}, this.state.compos.stageOffset, {
            top: titleBarCollapsed ? 35 : 80,
            left: resourceBarCollapsed ? 24 : 184,
            right: propsBarCollapsed ? 24 : 250
        });
        this.setState({
            compos: Object.assign({}, this.state.compos, { stageOffset: newStageOffset })
        });
    }

    StageStyle = () => {
        const stageOffset = this.state.compos.stageOffset;

        return {
            top: `${stageOffset.top}px`,
            left: `${stageOffset.left}px`,
            right: `${stageOffset.right}px`,
            bottom: `${stageOffset.bottom}px`
        } as React.CSSProperties;
    }

    // 获取stage上滚动条的偏移量
    getStageScroll = () => {
        let scrollLeft: number = 0;
        let scrollTop: number = 0;
        if (this.stage !== null) {
            scrollLeft = this.stage.scrollLeft;
            scrollTop = this.stage.scrollTop;
        }

        return { scrollLeft, scrollTop };
    }

    // 修改滚动条
    setStageScroll = (offset: IOffset) => {
        if (this.stage !== null) {
            this.stage.scrollLeft += offset.x;
            this.stage.scrollTop += offset.y;
        }
    }

    // 获取stage的边界范围
    getStageBoundary = () => {
        if (this.stage === null) return;

        const stageOffset = this.state.compos.stageOffset;
        const width = this.stage.offsetWidth;
        const height = this.stage.offsetHeight;

        return {
            startPoint: { x: stageOffset.left, y: stageOffset.top },
            endPoint: {
                x: stageOffset.left + width,
                y: stageOffset.top + height
            }
        } as IBoundary;
    }

    getStageSize = () => {
        if (this.stage === null) return;

        const width = this.stage.offsetWidth;
        const height = this.stage.offsetHeight;

        return { width, height };
    }

    // 获取命令，并传给canvas
    onCommandEmitted = (cmd: any) => {
        if (this.canvas) {
            this.canvas.executeCommand(cmd);
        }
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
                    console.log(compProperty);
                    this.barList.setPropertyState(compProperty);
                }
    }

    // 将propertyTool的修改的属性传给canvas 设置对应的选中控件
    onFireProperties = (pKey: string, pValue: any) => {
        if (this.canvas) {
            this.canvas.executeProperties(pKey, pValue);
        }
    }

    // 清除属性工具栏状态
    clearSelectedProperty = () => {
        if (this.barList) {
            this.barList.clearPropertyState();
        }
    }

    /**
     * 修改画布大小
     */
    updateCanvasSize = (width: number, height: number) => {
        this.setState({ canvasSize: { width, height } });
    }

    render() {
        const { compos, canvasSize } = this.state;
        const stateStyle = this.StageStyle();

        return (
            <div className="main-editor">
                <BarList
                    ref={(render) => this.barList = render}
                    changeStageOffset={this.changeStageOffset}
                    onCommandEmitted={this.onCommandEmitted}
                    onFireProperties={this.onFireProperties}
                    onPropertyProperties={this.onPropertyProperties}
                    // objectlist={this.props.objectlist}
                />
                <div id="stage" ref={(render) => this.stage = render} className="stage" style={stateStyle}>
                    <Draw
                        ref={(render) => this.draw = render}
                        getCanvas={this.getCanvas}
                        canvasSize={canvasSize}
                        componentPosition={compos}
                        getStageScroll={this.getStageScroll}
                    />
                    <Canvas
                        ref={(render) => this.canvas = render}
                        getDraw={this.getDraw}
                        canvasSize={canvasSize}
                        componentPosition={compos}
                        getStageScroll={this.getStageScroll}
                        setStageScroll={this.setStageScroll}
                        getStageBoundary={this.getStageBoundary}
                        getStageSize={this.getStageSize}
                        components={detail.content.components}
                        onCommandProperties={this.onCommandProperties}
                        onPropertyProperties={this.onPropertyProperties}
                        updateCanvasSize={this.updateCanvasSize}
                        clearSelectedProperty={this.clearSelectedProperty}
                    />
                </div>
            </div>
        );
    }
}

const detail = {
    content: {
        components: [
            // {
            //     t: 'BaseComponent/demo/Demo',
            //     p: {
            //         id: 'cs1',
            //         txt_v: '我是测试组件1',
            //         w: 200,
            //         h: 125,
            //         l: 10,
            //         t: 10
            //     }
            // },
            // {
            //     t: 'BaseComponent/demo/Demo',
            //     p: {
            //         id: 'cs2',
            //         txt_v: '我是测试组件2',
            //         w: 300,
            //         h: 200,
            //         l: 300,
            //         t: 10
            //     }
            // },
            // {
            //     t: 'BaseComponent/demo/Demo',
            //     p: {
            //         id: 'cs3',
            //         txt_v: '我是测试组件3',
            //         w: 200,
            //         h: 200,
            //         l: 150,
            //         t: 150
            //     }
            // },

            {
                t: 'MapComponent/demo/TableDemo',
                p: {
                    id: 'cs5',
                    txt_v: '我是测试组件5',
                    w: 1400,
                    h: 200,
                    l: 150,
                    t: 150
                }
            }
            // {
            //     t: 'MapComponent/map/AppGridForm',
            //     p: {
            //         id: 'cs4',
            //         txt_v: '编辑页面',
            //         w: 600,
            //         h: 400,
            //         l: 450,
            //         t: 350,
            //         p: {
            //             components: [
            //                 {
            //                     t: 'MapComponent/map/ProjectDDTree',
            //                     p: {
            //                         id: 'cs5.cs1'
            //                     }
            //                 },
            //                 {
            //                     t: 'MapComponent/map/AppView',
            //                     p: {
            //                         id: 'cs5.cs2'
            //                     }
            //                 },
            //                 {
            //                     t: 'MapComponent/map/AppFind',
            //                     p: {
            //                         id: 'cs5.cs3'
            //                     }
            //                 },
            //                 {
            //                     t: 'MapComponent/map/AppGridMenu',
            //                     p: {
            //                         id: 'cs5.cs4',
            //                         p: {
            //                             components: [
            //                                 {
            //                                     t: 'MapComponent/map/AppGridMenuItem',
            //                                     p: {
            //                                         id: 'cs5.cs4.cs1',
            //                                         map_mi_txt: '新增'
            //                                     }
            //                                 },
            //                                 {
            //                                     t: 'MapComponent/map/AppGridMenuItem',
            //                                     p: {
            //                                         id: 'cs5.cs4.cs2',
            //                                         map_mi_txt: '删除'
            //                                     }
            //                                 },
            //                                 {
            //                                     t: 'MapComponent/map/AppGridMenuItem',
            //                                     p: {
            //                                         id: 'cs5.cs4.cs3',
            //                                         map_mi_sa: true
            //                                     }
            //                                 }
            //                             ]
            //                         }
            //                     }
            //                 },
            //                 {
            //                     t: 'MapComponent/map/AppGrid',
            //                     p: {
            //                         id: 'cs5.cs5',
            //                         p: {
            //                             components: [
            //                                 {
            //                                     t: 'MapComponent/map/AppGridTitle',
            //                                     p: {
            //                                         id: 'cs5.cs5.cs1',
            //                                         map_gt_txt: 'AAA'
            //                                     }
            //                                 },
            //                                 {
            //                                     t: 'MapComponent/map/AppGridTitle',
            //                                     p: {
            //                                         id: 'cs5.cs5.cs2',
            //                                         map_gt_txt: 'BBB'
            //                                     }
            //                                 },
            //                                 {
            //                                     t: 'MapComponent/map/AppGridTitle',
            //                                     p: {
            //                                         id: 'cs5.cs5.cs3',
            //                                         map_gt_txt: 'CCC'
            //                                     }
            //                                 }
            //                             ]
            //                         }
            //                     }
            //                 }
            //             ]
            //         }
            //     }
            // }
        ]
    },
    layout: { mode: 'free' }
};
