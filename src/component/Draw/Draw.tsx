import * as React from 'react';

import { IDrawComponent } from './IDrawComponent';
import { IDrawProps } from './IDrawProps';
import { IDrawState } from './IDrawState';
import { IReactData, IBaseData } from './model/types';
import { DrawStyle } from './model/DrawStyle';
import { Selected } from './box/SelectedBoxComponent';
import { ChoiceBox, IChoiceBoxData } from './box/ChoiceBoxComponent';
import { Stretch } from './box/StretchBoxComponent';
import { Set } from 'immutable';
import { IComponent } from '../BaseComponent';

/* tslint:disable:no-console */
export class Draw extends React.PureComponent<IDrawProps, IDrawState> implements IDrawComponent {
    private draw: HTMLDivElement | null = null;

    constructor(props: IDrawProps, context?: any) {
        super(props, context);
        this.state = {
            rectList: [],
            choiceBox: null,
            canvasSize: this.props.canvasSize
        };
    }

    getComponent = (cid: string): IComponent | null => {
        const canvas = this.props.getCanvas();
        if (canvas !== null) {
            return canvas.getComponent(cid);
        }

        return null;
    }

    // 绘制组件选中框
    drawSelectedBox = (cids: Set<string>) => {
        const rectList: JSX.Element[] = [];
        cids.map((cid) => {
            if (cid === undefined) return;

            const com = this.getComponent(cid);
            if (com === null) return;
            const frameData: IReactData = com.selectedFrameData();
            rectList.push(<Selected key={cid} cid={cid} type={com.getType()} data={frameData} />);
        });
        this.setState({ rectList });
    }

    // 绘制组件大小拉伸框
    drawStretchBox = (data: IBaseData[]) => {
        const rectList: JSX.Element[] = [];
        data.map((item: IBaseData) => {
            const cid: string = item.cid;
            if (cid === undefined) return;

            const com = this.getComponent(cid);
            if (com === null) return;
            const frameData: IReactData = com.stretchFrameData(item);
            rectList.push(
                <Stretch key={item.cid} cid={item.cid} type={item.type} data={frameData} anchorKey={item.anchorKey} />
            );
        });
        this.setState({ rectList });
    }

    // 绘制拉选框
    drawChoiceBox = (data: { pointX: number, pointY: number, offset: any, style: React.CSSProperties } | null) => {
        let choiceBox = null;
        if (data !== null) {
            choiceBox = {
                pointX: data.pointX,
                pointY: data.pointY,
                offset: data.offset,
                style: data.style
            } as IChoiceBoxData;
        }
        this.setState({ choiceBox });
    }

    /**
     * 设置画布大小
     */
    setCanvasSize = (canvasSize: { width: number; height: number; }) => {
        this.setState({ canvasSize });
    }

    render() {
        const { rectList, choiceBox, canvasSize } = this.state;

        return (
            // tslint:disable-next-line:jsx-no-string-ref
            <div className="draw" style={DrawStyle(canvasSize)} ref={(draw) => this.draw = draw}>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%">
                    {rectList}
                    {choiceBox === null ? '' : <ChoiceBox key="canvas" data={choiceBox} />}
                </svg>
            </div>
        );
    }
}

/**
 *  本组件是用svg画图的合集，实际操作中发现svg画出的图像偏大，不是真实的像素值，
 *  经过查资料得出以下结论：
 *  1.通过调整颜色和与背景的颜色差。比如纯白背景，纯黑线条就很清晰。
 *  2.画布上的坐标并未对应网页里的像素，在绘制这个1px的横线，它会把这个1px劈成两半，
 *  然后显示器根据你传来的东西会显示成模糊结果。
 *  解决办法：
 *  如果横线，那就在y值上加个0.5。
 *  如果竖线，那就在x值上加个0.5。
 */
