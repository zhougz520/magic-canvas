import * as React from 'react';
import { IDrawComponent, IDrawProps, IDrawState, DrawStyle } from '../index';
import { Frame, IReactData } from '../box/FrameComponent';
import { ChoiceBox, IChoiceBoxData } from '../box/ChoiceBoxComponent';
import DrawComponent from '../DrawComponent';
import { Set } from 'immutable';
import { IComponent } from '../../BaseComponent';

/* tslint:disable:no-console */
export default class Draw extends DrawComponent<IDrawProps, IDrawState> implements IDrawComponent {
    private draw: HTMLDivElement | null = null;

    constructor(props: IDrawProps, context?: any) {
        super(props, context);
        this.state = {
            cids: Set<string>(),
            choiceBox: null
        };
    }

    getComponent = (cid: string): IComponent | null => {
        const canvas = this.props.getCanvas();
        if (canvas !== null) {
            return canvas.getComponent(cid);
        }

        return null;
    }

    setSelectedCids = (cids: Set<string>) => {
        this.setState({ cids });
    }

    // 绘制拉选框
    drawChoiceBox = (data: { pointX: number, pointY: number, offset: any } | null) => {
        const pos = this.props.componentPosition;
        let choiceBox = null;
        if (data !== null) {
            choiceBox = {
                pointX: data.pointX - pos.stageOffset.left,
                pointY: data.pointY - pos.stageOffset.top,
                offset: data.offset,
                fill: '#108ee9',
                fillOpacity: 0.05,
                stroke: '#108ee9',
                strokeWidth: 1
            } as IChoiceBoxData;
        }
        this.setState({ choiceBox });
    }

    render() {
        const frameRect: any = this.getSelectedFrame();

        return (
            // tslint:disable-next-line:jsx-no-string-ref
            <div className="draw" style={DrawStyle} ref={(draw) => this.draw = draw}>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%">
                    {frameRect}
                    {this.state.choiceBox === null ? '' : <ChoiceBox key="canvas" data={this.state.choiceBox} />}
                </svg>
            </div>
        );
    }

    // 根据选中的组件cid 绘制组件选中框
    getSelectedFrame = (): JSX.Element[] => {
        const frameRect: JSX.Element[] = [];
        const pos = this.props.componentPosition;
        this.state.cids.map((cid) => {
            if (cid === undefined) return;

            const com = this.getComponent(cid);
            if (com === null) return;

            const frameData: IReactData = {
                pointX: com.getPosition().left + pos.canvasOffset.left + 0.5,
                pointY: com.getPosition().top + pos.canvasOffset.top + 0.5,
                width: com.getSize().width + 1,
                height: com.getSize().height + 1,
                anchorFill: '#fff',
                stroke: '#108ee9',
                strokeWidth: 1,
                borderOffset: pos.borderOffset.border * 2
            };
            // tslint:disable-next-line:max-line-length
            frameRect.push(<Frame key={cid} cid={cid} data={frameData} />);
        });

        return frameRect;
    }
}

    /**
     *  本组件是用svg画图的合集，实际操作中发现svg画出的图像偏大，不是真实的像素值，
     *  经过查资料得出以下结论：
     *  1.通过调整颜色和与背景的颜色差。比如纯白背景，纯黑线条就很清晰。
     * 2.画布上的坐标并未对应网页里的像素，在绘制这个1px的横线，它会把这个1px劈成两半，
     * 然后显示器根据你传来的东西会显示成模糊结果。
     * 解决办法：
     * 如果横线，那就在y值上加个0.5。
     * 如果竖线，那就在x值上加个0.5。
     */
