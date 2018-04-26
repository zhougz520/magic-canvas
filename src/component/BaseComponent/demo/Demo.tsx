import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../index';
import { Button, Icon, Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import '../sass/Demo.scss';

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
    public antCom: any = null;

    public render() {
        const richChildNode = this.getRichChildNode();

        return (
            <div
                ref={(handler: HTMLElement | null) => this.com = handler}
                onMouseDown={this.fireSelectChange}
                onMouseUp={this.onMouseUp}
                // onDoubleClick={this.doDbClickToEdit}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy())}
            >
                <div
                    id="demoSass"
                >
                    {this.getCid() + '.'} - {richChildNode}
                </div>
                <Button
                    type="primary"
                    size="small"
                    onClick={this.click}
                    ref={(handler) => this.antCom = handler}
                >
                    DemoClick
                </Button>
                <Icon type="fast-backward" />
                <br />
                <RadioGroup
                    defaultValue="a"
                    options={[{label: 'radio1', value: 1}, {label: 'radio2', value: 2}, {label: 'radio3', value: 3}]}
                >
                    <RadioButton value="a">Hangzhou</RadioButton>
                    <RadioButton value="b">Shanghai</RadioButton>
                    <RadioButton value="c">Beijing</RadioButton>
                    <RadioButton value="d">Chengdu</RadioButton>
                </RadioGroup>
            </div>
        );
    }

    private click = (): void => {
        // const baseState: BaseState = this.getBaseState();

        // tslint:disable-next-line:no-console
        console.log(this.getStyle(this.antCom));
    }

    /**
     * 组件选中事件
     * @param cid 组件ref标识
     */
    private onMouseUp = (e: any) => {
        // this.fireSelectChange(cid, e);
    }
}
