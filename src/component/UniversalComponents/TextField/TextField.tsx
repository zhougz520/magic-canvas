import * as React from 'react';
import { BaseComponent, IBaseState, IBaseProps, ContentState, SizeState, PositionState, BaseState } from '../../..';
import { Input } from 'antd';

import { BaseStyle } from '../../MapComponent';
import { TextFieldState } from './TextFieldState';

const { TextArea } = Input;
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class TextField extends BaseComponent<IDemoProps, IBaseState> {
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
            richChildNode: props.data.txt_v,
            customState: new TextFieldState()

        });

        this.state = {
            baseState: BaseState.createWithContent(contentState)
        } as Readonly<IBaseState>;
    }

    render() {

        return (

            <div
                onMouseDown={this.onMouseDown}
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy())}
            >
                <TextArea
                    rows={this.getCustomState().getRowNum()}
                    placeholder={this.getCustomState().getPlaceholder()}
                    onClick={this.onClick}
                    value={this.getRichChildNode()}
                />
            </div>
        );
    }

    private onClick = () => {
        const newTextFieldState: TextFieldState = TextFieldState.set(
            this.getCustomState(),
            {
                placeholder: 'this is a new placeholder'
            }
        );

        this.setCustomState(newTextFieldState);
    }

    /**
     * 组件选中事件
     * @param cid 组件ref标识
     */
    private onMouseDown = (e: any) => {
        this.fireSelectChange(e, this.getCid());
    }
}
