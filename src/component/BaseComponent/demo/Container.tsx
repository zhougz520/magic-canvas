import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../index';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {
}

export interface IDemoState extends IBaseState {
    demoState: string;
}
export default class Container extends BaseComponent<IDemoProps, IDemoState> {
    public com: HTMLElement | null = null;

    public render() {
        const richChildNode = this.getRichChildNode();
        const { p } = this.props.data;
        const children: any = [];
        if (p !== undefined && p.components.length > 0) {
            p.components.forEach((com: any) => {
                children.push(
                    <button>
                        能不能不提交报错代码
                    </button>
                );
            });
        }

        // 汇总style
        const currStyle = Object.assign(
            BaseStyle(
                this.getPositionState(),
                this.getSizeState(),
                this.getHierarchy()
            ),
            {
                overflow: 'auto'
            }
        );

        return (
            <div
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={currStyle}
                // onMouseDown={this.fireSelectChange}
            >
                <div
                    style={{ backgroundColor: '#F0F0FF'}}
                >
                    {this.getCid() + '.'} - {richChildNode}
                </div>
                {children}
            </div>
        );
    }
}
