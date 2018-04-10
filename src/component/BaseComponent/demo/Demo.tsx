import * as React from 'react';
import { BaseComponent, BaseState, IBaseProps, IBaseState, BaseStyle } from '../index';
import { Button, Icon } from 'antd';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {
}

export interface IDemoState extends IBaseState {
    demoState: string;
}

export default class Demo extends BaseComponent<IDemoProps, IDemoState> {
    static defaultProps = {
        data: {
            id: 'cs2',
            txt_v: '我是测试组件2',
            w: 300,
            h: 200,
            l: 300,
            t: 10
        }
    };

    public com: HTMLElement | null = null;

    public render() {
        const richChildNode = this.getRichChildNode();

        return (
            <div
                ref={(handler: HTMLElement | null) => this.com = handler}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy())}
            >
                <div
                    style={{ backgroundColor: '#F0F0FF' }}
                >
                    {this.getCid() + '.'} - {richChildNode}
                </div>
                <Button type="primary" size="small" onClick={this.click}>DemoClick</Button>
                <Icon type="fast-backward" />
            </div>
        );
    }

    private click = (): void => {
        const baseState: BaseState = this.getBaseState();
        // tslint:disable-next-line:no-console
        console.log(baseState);
    }

    /**
     * 组件选中事件
     * @param cid 组件ref标识
     */
    private onMouseDown = (e: any) => {
        this.fireSelectChange(e, this.getCid());
    }

    /**
     * 组件选中事件
     * @param cid 组件ref标识
     */
    private onMouseUp = (e: any) => {
        // this.fireSelectChange(cid, e);
    }
}
