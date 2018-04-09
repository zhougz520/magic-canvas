import * as React from 'react';
import BarList from './BarComponent';
import Draw from './DrawComponent/draw';
import Canvas from './CanvasComponent/canvas';
import { IDrawComponent } from './DrawComponent';
import { ICanvasComponent } from './CanvasComponent/inedx';
import './solution.css';
import { ICompos, config } from './config';
import { EditComponent } from './EditComponent';
import { IComponent } from './BaseComponent';

export interface ISolutionProp {
    [key: string]: any;
}

export interface ISolutionState {
    compos: ICompos;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class SolutionEditor extends React.PureComponent<ISolutionProp, ISolutionState> {
    private canvas: ICanvasComponent | null = null;
    private draw: IDrawComponent | null = null;
    private edit: EditComponent | null = null;

    constructor(props: ISolutionProp) {
        super(props);
        this.state = {
            compos: config.componentPosition
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
    // 准备开始编辑，通知EditComponent获得焦点
    beforeEditCom = (com: IComponent): void => {
        if (null !== this.edit) this.edit.onEditComFocus(com);
    }

    StageStyle = (stageOffset: { top: number, left: number, right: number, bottom: number }) => {
        return {
            top: `${stageOffset.top}px`,
            left: `${stageOffset.left}px`,
            right: `${stageOffset.right}px`,
            bottom: `${stageOffset.bottom}px`
        } as React.CSSProperties;
    }

    render() {
        const { compos } = this.state;

        return (
            <div className="main-editor">
                <BarList changeStageOffset={this.changeStageOffset} />
                <div className="stage" style={this.StageStyle(compos.stageOffset)}>
                    <EditComponent
                        ref={(render: EditComponent) => this.edit = render}
                        componentPosition={compos}
                    />
                    <Draw
                        ref={(render) => this.draw = render}
                        getCanvas={this.getCanvas}
                        componentPosition={compos}
                    />
                    <Canvas
                        ref={(render) => this.canvas = render}
                        getDraw={this.getDraw}
                        componentPosition={compos}
                        components={detail.content.components}
                        beforeEditCom={this.beforeEditCom}
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
                    h: 200,
                    l: 250,
                    t: 250,
                    p: {
                        components: [
                            {
                                t: 'MapComponent/demo/BtnDemo',
                                p: {
                                    id: 'cs4.cs1',
                                    txt_v: '我是内部组件-按钮1',
                                }
                            },
                            {
                                t: 'MapComponent/demo/BtnDemo',
                                p: {
                                    id: 'cs4.cs2',
                                    txt_v: '我是内部组件-按钮2',
                                }
                            },
                            {
                                t: 'MapComponent/demo/BtnDemo',
                                p: {
                                    id: 'cs4.cs3',
                                    txt_v: '我是内部组件-按钮3',
                                }
                            },
                            {
                                t: 'MapComponent/demo/BtnDemo',
                                p: {
                                    id: 'cs4.cs4',
                                    txt_v: '我是内部组件-按钮4',
                                }
                            },
                        ]
                    }
                }
            }
        ]
    },
    layout: { mode: 'free' }
};
