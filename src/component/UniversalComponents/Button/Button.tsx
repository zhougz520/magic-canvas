import * as React from 'react';
import { Button as AntButton } from 'antd';

import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState, ContentState, SizeState, PositionState, BaseState
} from '../../BaseComponent';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {
}
// tslint:disable-next-line:no-empty-interface
export interface IDemoState {
    aa: string;
}

export default class Button extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;

    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        const contentState: ContentState = ContentState.create({
            cid: props.data.id,
            zIndex: props.zIndex,
            sizeState: SizeState.create({
                width: props.data.w,
                height: props.data.h
            }),
            positionState: PositionState.create({
                left: props.data.l,
                right: props.data.r,
                top: props.data.t,
                bottom: props.data.b
            }),
            // TODO 带格式的富文本
            richChildNode: props.data.txt_v
        });

        this.state = {
            baseState: BaseState.createWithContent(contentState)
        } as Readonly<IBaseState>;
    }

    render() {
        return (
            <AntButton
                type="primary"
                onMouseDown={this.onMouseDown}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy())}
                ref={(handler) => this.com = handler}
            >
                {this.getRichChildNode() as JSX.Element}
            </AntButton>
        );
    }

    /**
     * 组件选中事件
     * @param cid 组件ref标识
     */
    private onMouseDown = (e: any) => {
        this.fireSelectChange(e, this.getCid());
    }
}
