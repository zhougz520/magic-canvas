import * as React from 'react';
import BarList from './BarComponent';
import Draw from './DrawComponent/draw';
import Canvas from './CanvasComponent/canvas';
import { IDrawComponent } from './DrawComponent';
import { ICanvasComponent } from './CanvasComponent/inedx';
import { EditComponent } from './EditComponent';
import { IComponent } from './BaseComponent';
import styled from 'styled-components';

export interface ISolutionProp {
    [key: string]: any;
}

export interface ISolutionState {
    stageOffset: { top: number, left: number };
    canvasOffset: { top: number, left: number };
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class SolutionEditor extends React.PureComponent<ISolutionProp, ISolutionState> {
    private canvas: ICanvasComponent | null = null;
    private draw: IDrawComponent | null = null;
    private edit: EditComponent | null = null;

    constructor(props: ISolutionProp) {
        super(props);
    }

    getDrawRef = (): IDrawComponent | null => {
        return this.draw;
    }

    getCanvas = () => {
        return this.canvas;
    }

    getDraw = () => {
        return this.draw;
    }

    // 准备开始编辑，通知EditComponent获得焦点
    beforeEditCom = (com: IComponent): void => {
        if (null !== this.edit) this.edit.onEditComFocus(com);
    }

    render() {
        const compos = {
            stageOffset: { top: 80, left: 184, right: 250, bottom: 35 },  // stage相对body的偏移量
            canvasOffset: { top: 48, left: 48 }  // canvas相对stage的偏移量
        };

        const StageStyle = styled.div`
                position: absolute;
                top: ${compos.stageOffset.top}px;
                left: ${compos.stageOffset.left}px;
                right: ${compos.stageOffset.right}px;
                bottom: ${compos.stageOffset.bottom}px;
                margin: auto;
                overflow: auto;
                background-color: #f3f3f3;
                display: block;
        `;

        return (
            <div className="main-editor">
                <BarList />
                <StageStyle className="stage">
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
                </StageStyle>
            </div>
        );
    }
}

const detail = {
    content: {
        components: [
            {
                t: 'Demo',
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
                t: 'Demo',
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
                t: 'Demo',
                p: {
                    id: 'cs3',
                    txt_v: '我是测试组件3',
                    w: 200,
                    h: 200,
                    l: 150,
                    t: 150
                }
            }
        ]
    },
    layout: { mode: 'free' }
};
