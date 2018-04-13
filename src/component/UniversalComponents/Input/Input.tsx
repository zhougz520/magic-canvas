import * as React from 'react';
import { BaseComponent, IBaseState, IBaseProps} from '../../..';
import { InputState } from './InputState';
import { Input  as AntInput } from 'antd';

import { BaseStyle } from '../../MapComponent';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Input extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new InputState())
        } as Readonly<IBaseState>;
    }

    render() {

        return (

            <div
                onMouseDown={this.fireSelectChange}
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy())}
            >
                <AntInput

                    placeholder={this.getCustomState().getPlaceholder()}
                    onClick={this.onClick}
                    value={this.getRichChildNode()}
                />
            </div>
        );
    }

    private onClick = () => {
        const newInputState: InputState = InputState.set(
            this.getCustomState(),
            {
                placeholder: 'this is a new placeholder'
            }
        );

        this.setCustomState(newInputState);
    }

}
