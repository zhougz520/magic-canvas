import * as React from 'react';
import { Button as AntButton } from 'antd';

import { BaseComponent, BaseStyle, IBaseProps, IBaseState } from '../../BaseComponent';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {
}
// tslint:disable-next-line:no-empty-interface
export interface IDemoState extends IBaseState {
}

export default class Button extends BaseComponent<IDemoProps, IDemoState> {
    render() {
        const aa: JSX.Element = (<h1>123</h1>);

        return (
            <AntButton
                type="primary"
                onMouseDown={this.onMouseDown}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy())}
            >
                {aa}
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
