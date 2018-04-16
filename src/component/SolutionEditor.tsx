import * as React from 'react';
import BarList from './BarComponent';
import Draw from './DrawComponent/draw';
import Canvas from './CanvasComponent/canvas';
import { IDrawComponent } from './DrawComponent';
import { ICanvasComponent, IBoundary } from './CanvasComponent/inedx';
import './solution.css';
import { ICompos, config } from './config';
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
                <BarList changeStageOffset={this.changeStageOffset} />
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
            }
        ]
    },
    layout: { mode: 'free' }
};
