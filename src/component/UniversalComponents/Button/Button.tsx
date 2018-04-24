import * as React from 'react';
import { Button as AntButton } from 'antd';

import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { ButtonState } from './ButtonState';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {
}

export default class Button extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;

    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new ButtonState())
        };
    }

    render() {
        return (
            <AntButton
                type={this.getCustomState().getType()}
                onMouseDown={this.fireSelectChange}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                ref={(handler) => this.com = handler}
                onClick={this.onClick}
            >
                {this.getRichChildNode() as JSX.Element}
            </AntButton>
        );
    }

    private onClick = () => {
        const newButtonState: ButtonState = ButtonState.set(
            this.getCustomState(),
            {
                type: 'danger'
            }
        );

        this.setCustomState(newButtonState);
    }

}
