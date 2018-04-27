import * as React from 'react';
import { Button as AntButton } from 'antd';

import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { ButtonState } from './ButtonState';
import { PropertiesEnum, ComponentProperty } from '../../config';
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
        return (
            <AntButton
                type={this.getCustomState().getType()}
                onMouseDown={this.fireSelectChange}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                ref={(handler) => this.com = handler}
                onClick={this.onClick}
                shape="circle-outline"
            >
                {this.getRichChildNode() as JSX.Element}
            </AntButton>
        );
    }

    public getPropertiesToCommand = (): ComponentProperty  => {
        return {
            componentCid: this.getCustomState().getSelectedCid(),
            componentProperties: [
                {
                    pTitle: '类型',
                    pKey: 'type',
                    pValue: this.getCustomState().getType(),
                    pType: PropertiesEnum.SELECT
                }, {
                    pTitle: '是否为圆形按钮',
                    pKey: 'isCircle',
                    pValue: this.getCustomState().getIsCircle(),
                    pType: PropertiesEnum.SWITCH
                }
            ]
        };
    }

    public setPropertiesFromCommand = (cid: string, pProperty: {pKey: string, pValue: any}) => {
        let properties = Map();
        properties = properties.set(pProperty.pKey, pProperty.pValue);
        properties = properties.set('selectedCid', cid);
        const newInputState: ButtonState = ButtonState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

    public getPropertiesToProperty = (): ComponentProperty  => {
        return {
            componentCid: this.getCustomState().getSelectedCid(),
            componentProperties: [
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
            ]
        };
    }

    public setPropertiesFromProperty = (cid: string, pProperty: {pKey: string, pValue: any}) => {
        let properties = Map();
        properties = properties.set(pProperty.pKey, pProperty.pValue);
        properties = properties.set('selectedCid', cid);
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

    // private isCircle: 'circle' | 'circle-outline' | undefined = () => {
    //     if (this.getCustomState().getIsCircle()) {
    //         return 'circle';
    //     } else return undefined;
    // }

}
