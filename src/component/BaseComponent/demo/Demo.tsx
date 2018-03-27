import * as React from 'react';
import { BaseComponent, BaseState, IBaseProps, IBaseState, BaseStyle } from '../index';

export interface IDemoProps extends IBaseProps {
    demoProp: string;
}

export interface IDemoState extends IBaseState {
    demoState: string;
}

export class Demo extends BaseComponent<IDemoProps, IDemoState> {
    // constructor(props: IDemoProps) {
    //     super(props);
    // }

    public render() {
        const { demoProp } = this.props;

        const richChildNode = this.getRichChildNode();

        return (
            <div
                onMouseDown={this.onMouseDown.bind(this, demoProp)}
                onMouseUp={this.onMouseUp.bind(this, demoProp)}
                style={BaseStyle(this.getPositionState(), this.getSizeState())}
                tabIndex={0}
                onFocus={this.onFocus.bind(this, demoProp)}
                onBlur={this.onBlur.bind(this, demoProp)}
            >
                <div
                    style={{ backgroundColor: '#F0F0FF' }}
                >
                    {demoProp + '.'} - {richChildNode}
                </div>
                <button onClick={this.click}>DemoClick(console)</button>
            </div>
        );
    }

    private click = () => {
        const baseState: BaseState = this.getBaseState();
        // tslint:disable-next-line:no-console
        console.log(baseState);
    }

    /**
     * 组件选中事件
     * @param cid 组件ref标识
     */
    private onMouseDown = (cid: string, e: any) => {
        this.fireSelectChange(cid, e);
    }

    /**
     * 组件选中事件
     * @param cid 组件ref标识
     */
    private onMouseUp = (cid: string, e: any) => {
        // this.fireSelectChange(cid, e);
    }

    // TODO onFocus、onBlur方法需完善
    private onFocus = (cid: string, e: any) => {
        // tslint:disable-next-line:no-console
        console.log(cid + 'onFocus');
        this.onComFocus(cid, e);
    }

    private onBlur = (cid: string, e: any) => {
        // tslint:disable-next-line:no-console
        console.log(cid + 'onBlur');
    }
}
