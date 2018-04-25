import * as React from 'react';
import { BarList, IBarListComponent } from './BarComponent';
import Draw from './DrawComponent/draw';
import Canvas from './CanvasComponent/canvas';
import { IDrawComponent } from './DrawComponent';
import { ICanvasComponent, IBoundary } from './CanvasComponent/inedx';
import './solution.css';
import { ICompos, config, ComponentProperty } from './config';
import { IOffset } from './CanvasComponent/model/types';

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
        console.log(offset);
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
    // 获取command点击后的命令，并传给canvas
    onFireCommand = (cId: string, cProperty: {pName: string, pValue: any, pType: string}) => {
        console.log('找当前编辑中的组件，并传递command的命令');
        console.log('command:' + cProperty.pName + cProperty.pValue);

        if (this.canvas) {
            // 获取当前编辑中的组件
            const commandProperties = this.canvas.getSelectedProperties(cId);
            if (commandProperties) {
                this.canvas.executorCommand(cId, cProperty);
            }
        }
    }
    // 获取编辑中的组件属性并传给command
    onCommandProperties = (currentCid: string): ComponentProperty |undefined => {
        if (this.canvas) {
            const compProperty: ComponentProperty = {componentCid: currentCid, componentProperties: []};

            const commandProperties = this.canvas.getSelectedProperties(currentCid);
            compProperty.componentProperty = commandProperties;

            // commandProperties为undefined 则未选中组件
            if (commandProperties) {
                console.log('这是solutioneditor中给command的获取组件属性');
                console.log(commandProperties);
                if (this.barList) {
                    this.barList.setCommandState(currentCid, commandProperties.componentProperties);
                }

                return compProperty;
            } else return undefined;
        } else return undefined;
    }

    // 获取编辑中的组件属性并传给propertyTool
    onPropertyProperties = (currentCid: string): ComponentProperty| undefined => {
        if (this.canvas) {
            const compProperty: ComponentProperty = {componentCid: currentCid, componentProperties: []};
            const pToolProperties = this.canvas.getSelectedProperties(currentCid);
            if (pToolProperties !== undefined) {
                compProperty.componentProperties = pToolProperties.componentProperties;
                console.log('这是solutioneditor中给propertyTool的获取组件属性');
                if (this.barList) {
                    this.barList.setPropertyState(currentCid, pToolProperties.componentProperties);
                }

                return compProperty;
            } else return undefined;
        } else return undefined;
    }

    // 将propertyTool的属性传给canvas 设置对应的选中控件
    onFireProperties = (cId: string, cProperty: {pName: string, pValue: any, pType: string}) => {
        if (this.canvas) {
            const commandProperties = this.canvas.getSelectedProperties(cId);
            if (commandProperties) {
                console.log(commandProperties);
                this.canvas.executorProperties(cId, cProperty);
            }
        }
    }

    /**
     * 修改画布大小
     */
    updateCanvasSize = (width: number, height: number) => {
        console.log('重绘了画布的大小');
        this.setState({ canvasSize: { width, height } });
    }

    render() {
        const { compos, canvasSize } = this.state;
        const stateStyle = this.StageStyle();
        console.log('重绘了stage');

        return (
            <div className="main-editor">
                <BarList
                    ref={(render) => this.barList = render}
                    changeStageOffset={this.changeStageOffset}
                    onFireCommand={this.onFireCommand}
                    onCommandProperties={this.onCommandProperties}
                    onFireProperties={this.onFireProperties}
                    onPropertyProperties={this.onPropertyProperties}
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
                        components={detail.content.components}
                        onCommandProperties={this.onCommandProperties}
                        // tslint:disable-next-line:jsx-no-lambda
                        onPropertyProperties={this.onPropertyProperties}
                        updateCanvasSize={this.updateCanvasSize}
                    />
                </div>
            </div>
        );
    }
}

const detail = {
    content: {
        components: [
            {
                t: 'BaseComponent/demo/Demo',
                p: {
                    id: 'cs1',
                    txt_v: '我是测试组件1',
                    w: 200,
                    h: 125,
                    l: 10,
                    t: 10
                }
            },
            {
                t: 'BaseComponent/demo/Demo',
                p: {
                    id: 'cs2',
                    txt_v: '我是测试组件2',
                    w: 300,
                    h: 200,
                    l: 300,
                    t: 10
                }
            },
            {
                t: 'BaseComponent/demo/Demo',
                p: {
                    id: 'cs3',
                    txt_v: '我是测试组件3',
                    w: 200,
                    h: 200,
                    l: 150,
                    t: 150
                }
            },
            {
                t: 'BaseComponent/demo/Container',
                p: {
                    id: 'cs4',
                    txt_v: '我是测试组件4',
                    w: 200,
                    h: 400,
                    l: 250,
                    t: 250,
                    p: {
                        components: [
                            {
                                t: 'MapComponent/demo/BtnDemo',
                                p: {
                                    id: 'cs4.cs1',
                                    txt_v: '我是内部组件按钮1',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/demo/BtnChildDemo',
                                                p: {
                                                    id: 'cs4.cs1.cs1',
                                                    txt_v: '按钮1'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/demo/BtnChildDemo',
                                                p: {
                                                    id: 'cs4.cs1.cs2',
                                                    txt_v: '按钮1'
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                t: 'MapComponent/demo/BtnDemo',
                                p: {
                                    id: 'cs4.cs2',
                                    txt_v: '我是内部组件-按钮2',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/demo/BtnChildDemo',
                                                p: {
                                                    id: 'cs4.cs2.cs1',
                                                    txt_v: '按钮1'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/demo/BtnChildDemo',
                                                p: {
                                                    id: 'cs4.cs2.cs2',
                                                    txt_v: '按钮2'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/demo/BtnChildDemo',
                                                p: {
                                                    id: 'cs4.cs2.cs3',
                                                    txt_v: '按钮3'
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                t: 'MapComponent/demo/BtnDemo',
                                p: {
                                    id: 'cs4.cs3',
                                    txt_v: '我是内部组件-按钮3',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/demo/BtnChildDemo',
                                                p: {
                                                    id: 'cs4.cs3.cs1',
                                                    txt_v: '按钮1'
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                t: 'MapComponent/demo/BtnDemo',
                                p: {
                                    id: 'cs4.cs4',
                                    txt_v: '我是内部组件-按钮4',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/demo/BtnChildDemo',
                                                p: {
                                                    id: 'cs4.cs4.cs1',
                                                    txt_v: '按钮1'
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {
                t: 'MapComponent/map/AppGridForm',
                p: {
                    id: 'cs5',
                    txt_v: '编辑页面',
                    w: 600,
                    h: 400,
                    l: 450,
                    t: 350,
                    p: {
                        components: [
                            {
                                t: 'MapComponent/map/ProjectDDTree',
                                p: {
                                    id: 'cs5.cs1'
                                }
                            },
                            {
                                t: 'MapComponent/map/AppView',
                                p: {
                                    id: 'cs5.cs2'
                                }
                            },
                            {
                                t: 'MapComponent/map/AppFind',
                                p: {
                                    id: 'cs5.cs3'
                                }
                            },
                            {
                                t: 'MapComponent/map/AppGridMenu',
                                p: {
                                    id: 'cs5.cs4',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/AppGridMenuItem',
                                                p: {
                                                    id: 'cs5.cs4.cs1',
                                                    map_mi_txt: '新增'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/AppGridMenuItem',
                                                p: {
                                                    id: 'cs5.cs4.cs2',
                                                    map_mi_txt: '删除'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/AppGridMenuItem',
                                                p: {
                                                    id: 'cs5.cs4.cs3',
                                                    map_mi_sa: true
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        ]
    },
    layout: { mode: 'free' }
};
