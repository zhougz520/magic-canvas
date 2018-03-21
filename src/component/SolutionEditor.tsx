import * as React from 'react';
import Canvas from './CanvasComponent/canvas';
import Draw from './DrawComponent/draw';
import { Set } from 'immutable';
import { StageStyle } from './style';
// import * as PropTypes from 'prop-types';

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
    private canvas: Canvas | null = null;
    private draw: Draw | null = null;

    constructor(props: ISolutionProp) {
        super(props);
    }

    findComponentRef = (cid: string): void => {
        console.log(cid);
    }

    getDrawRef = (): Draw | null => {
        return this.draw;
    }

    // 显示选中框
    showSelected = (coms: Set<string>) => {
        if (null !== this.draw) this.draw.showFrame(coms);
    }

    // 回执拉选框
    drawChoiceBox = (data: { pointX: number, pointY: number, offset: any }) => {
        if (null !== this.draw) this.draw.drawChoiceBox(data);
    }

    componnetDispatcher = (cid: string) => {
        console.log(cid);
    }

    getCanvas = () => {
        return this.canvas;
    }

    render() {
        const componentPosition = {
            stageOffset: { top: 40, left: 24 },  // stage相对body的偏移量
            canvasOffset: { top: 48, left: 48 }  // canvas相对stage的偏移量
        };

        return (
            <div className="main-editor">
                <div className="stage" style={StageStyle(componentPosition.stageOffset)}>
                    <Draw
                        ref={(render) => this.draw = render}
                        getCanvas={this.getCanvas}
                        componentPosition={componentPosition}
                    />
                    <Canvas
                        ref={(render) => this.canvas = render}
                        showSelected={this.showSelected}
                        drawChoiceBox={this.drawChoiceBox}
                        componentPosition={componentPosition}
                    />
                </div>
            </div>
        );
    }
}
