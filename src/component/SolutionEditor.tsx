import * as React from 'react';
import BarList from './BarComponent';
import Draw from './DrawComponent/draw';
import Canvas from './CanvasComponent/canvas';
import { StageStyle } from './style';
import { IDrawComponent } from './DrawComponent';
import { ICanvasComponent } from './CanvasComponent/inedx';

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

    render() {
        const componentPosition = {
            stageOffset: { top: 40, left: 24 },  // stage相对body的偏移量
            canvasOffset: { top: 48, left: 48 }  // canvas相对stage的偏移量
        };

        return (
            <div className="main-editor">
                <BarList />
                <div className="stage" style={StageStyle(componentPosition.stageOffset)}>
                    <Draw
                        ref={(render) => this.draw = render}
                        getCanvas={this.getCanvas}
                        componentPosition={componentPosition}
                    />
                    <Canvas
                        ref={(render) => this.canvas = render}
                        getDraw={this.getDraw}
                        componentPosition={componentPosition}
                        components={detail.content.components}
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
