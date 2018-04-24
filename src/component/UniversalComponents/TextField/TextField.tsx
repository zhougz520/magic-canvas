import * as React from 'react';
import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { Input } from 'antd';

import { TextFieldState } from './TextFieldState';

const { TextArea } = Input;
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class TextField extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new TextFieldState())
        } as Readonly<IBaseState>;
    }
    render() {

        return (
            <div
                onMouseDown={this.fireSelectChange}
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
            >
                <TextArea
                    rows={this.getCustomState().getRowNum()}
                    placeholder={this.getCustomState().getPlaceholder()}
                    onClick={this.onClick}
                    onPressEnter={this.onClick}
                    autosize={false}
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

}
