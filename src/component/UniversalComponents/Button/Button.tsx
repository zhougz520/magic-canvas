import * as React from 'react';
import { Button as AntButton } from 'antd';

import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { ButtonState } from './ButtonState';
import { PropertiesEnum } from '../../config';
import { Map } from 'immutable';

export default class Button extends BaseComponent<IBaseProps, IBaseState> {
    private com: any = null;

    constructor(props: IBaseProps, context?: any) {
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
                shape="circle-outline"
            >
                {this.getRichChildNode() as JSX.Element}
            </AntButton>
        );
    }

    public getPropertiesToCommand = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '类型',
                    pKey: 'type',
                    pValue: this.getCustomState().getType(),
                    pType: PropertiesEnum.INPUT_LIST
                }, {
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
                    pTitle: '类型',
                    pKey: 'type',
                    pValue: this.getCustomState().getType(),
                    pType: PropertiesEnum.INPUT_LIST
                }, {
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

}
