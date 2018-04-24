import * as React from 'react';
import { IReactData, IDrawComponent, IDrawProps, IDrawState, DrawStyle } from '../index';
import { Selected } from '../box/SelectedBoxComponent';
import { ChoiceBox, IChoiceBoxData } from '../box/ChoiceBoxComponent';
import { Stretch } from '../box/StretchBoxComponent';
import DrawComponent from '../DrawComponent';
import { Set } from 'immutable';
import { IComponent } from '../../BaseComponent';
import { IBaseData } from '../model/types';

/* tslint:disable:no-console */
export default class Draw extends DrawComponent<IDrawProps, IDrawState> implements IDrawComponent {
    private draw: HTMLDivElement | null = null;

    constructor(props: IDrawProps, context?: any) {
        super(props, context);
        this.state = {
            rectList: [],
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

    findComponent = (cids: string[]): IComponent | null => {
        const canvas = this.props.getCanvas();
        if (canvas !== null) {
            return canvas.findComponent(cids.toString());
        }

        return null;
    }

    // 绘制组件选中框
    drawSelectedBox = (cids: Set<string>) => {
        const rectList: JSX.Element[] = [];
        const pos = this.props.componentPosition;
        cids.map((cid) => {
            if (cid === undefined) return;
            const cids_curr: string[] = cid.split('.');
            const com = this.getComponent(cids_curr[0]);
            const lastCom = cids_curr.length > 1 ? this.findComponent(cids_curr) as any : null;
            if (com === null) return;

            const frameData: IReactData = {
                pointX: (lastCom === null ? com.getPosition().left : com.getPosition().left + lastCom.com.offsetLeft)
                         + pos.canvasOffset.left + 0.5,
                pointY: (lastCom === null ? com.getPosition().top : com.getPosition().top + lastCom.com.offsetTop)
                         + pos.canvasOffset.top + 0.5,
                width: (lastCom === null ? com.getSize().width : lastCom.com.offsetWidth) + 1,
                height: (lastCom === null ? com.getSize().height : lastCom.com.offsetHeight) + 1,
                anchorFill: '#fff',
                stroke: '#108ee9',
                strokeWidth: 1,
                borderOffset: pos.borderOffset.border * 2
            };
            rectList.push(<Selected key={cid} cid={cid} type={com.getType()} data={frameData} />);
        });
        this.setState({ rectList });
    }

    // 绘制组件大小拉伸框
    drawStretchBox = (data: IBaseData[]) => {
        const rectList: JSX.Element[] = [];
        const pos = this.props.componentPosition;
        data.map((item: IBaseData) => {
            const frameData: IReactData = {
                pointX: item.position.left + pos.canvasOffset.left + 0.5,
                pointY: item.position.top + pos.canvasOffset.top + 0.5,
                width: item.size.width + 1,
                height: item.size.height + 1,
                anchorFill: '#fff',
                stroke: '#108ee9',
                strokeWidth: 1,
                borderOffset: pos.borderOffset.border * 2
            };
            rectList.push(
                <Stretch key={item.cid} cid={item.cid} type={item.type} data={frameData} anchorKey={item.anchorKey} />
            );
        });
        this.setState({ rectList });
    }

    // 绘制拉选框
    drawChoiceBox = (data: { pointX: number, pointY: number, offset: any } | null) => {
        let choiceBox = null;
        if (data !== null) {
            choiceBox = {
                pointX: data.pointX,
                pointY: data.pointY,
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
        return (
            // tslint:disable-next-line:jsx-no-string-ref
            <div className="draw" style={DrawStyle(this.props.canvasSize)} ref={(draw) => this.draw = draw}>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%">
                    {this.state.rectList}
                    {this.state.choiceBox === null ? '' : <ChoiceBox key="canvas" data={this.state.choiceBox} />}
                </svg>
            </div>
        );
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
