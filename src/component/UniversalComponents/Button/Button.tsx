import * as React from 'react';
import { Button as AntButton } from 'antd';

import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { ButtonState } from './ButtonState';
import { PropertiesEnum } from '../../config';
import { Map } from 'immutable';

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
        const circle: 'circle' | 'circle-outline' | undefined = this.setCircle();

        return (
            <AntButton
                type={this.getCustomState().getType()}
                onMouseDown={this.fireSelectChange}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                ref={(handler) => this.com = handler}
                onClick={this.onClick}
                shape={circle}
            >
                {this.getRichChildNode() as JSX.Element}
            </AntButton>
        );
    }

    public getPropertiesToCommand = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '是否为圆形按钮',
                    pKey: 'isCircle',
                    pValue: this.getCustomState().getIsCircle(),
                    pType: PropertiesEnum.SWITCH
                }
            ];
    }

    public setPropertiesFromCommand = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newInputState: ButtonState = ButtonState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '是否为圆形按钮',
                    pKey: 'isCircle',
                    pValue: this.getCustomState().getIsCircle(),
                    pType: PropertiesEnum.SWITCH
                }
            ];
    }

    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newInputState: ButtonState = ButtonState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
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

    private setCircle = (): 'circle' | 'circle-outline' | undefined   => {
        if (this.getCustomState().getIsCircle()) {
            return 'circle-outline';
        } else return undefined;
    }

}
