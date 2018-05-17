import * as React from 'react';
import { Button as AntButton } from 'antd';

import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { ButtonState } from './ButtonState';
import { PropertiesEnum } from '../types';
import { Map } from 'immutable';

export default class Button extends BaseComponent<IBaseProps, IBaseState> {
    com: any = null;

    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new ButtonState())
        };
    }

    render() {
        const circle: 'circle' | 'circle-outline' | undefined = this.setCircle();

        return (
            <div
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                onMouseDown={this.fireSelectChange}
            >
                <AntButton
                    // tslint:disable-next-line:jsx-no-multiline-js
                    style={{width: '100%', height: '100%', color: this.getCustomState().getFontColor(),
                        fontStyle: this.getCustomState().getFontStyle(), textDecoration: this.getCustomState().getTextDecoration(), fontSize: this.getCustomState().getFontSize() + 'px',
                        fontWeight: this.getCustomState().getFontWeight(), backgroundColor: this.getCustomState().getBackgroundColor(),
                        // , borderStyle: 'solid',
                        borderColor: this.getCustomState().getBorderColor(), borderWidth: this.getCustomState().getBorderWidth() + 'px'
                    }}
                    type={this.getCustomState().getType()}
                    ref={(handler) => this.com = handler}
                    // onClick={this.onClick}
                    shape={circle}
                    disabled={this.getCustomState().getDisabled()}
                >
                    <span
                        style={{display: 'inline-block', width: '100%', textAlign: this.getCustomState().getTextAlign()}}
                    >
                        {this.getCustomState().getTextValue()}
                    </span>
                </AntButton>
            </div>
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
        const newButtonState: ButtonState = ButtonState.set(this.getCustomState(), properties);

        this.setCustomState(newButtonState);
    }

    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '是否为圆形按钮',
                    pKey: 'isCircle',
                    pValue: this.getCustomState().getIsCircle(),
                    pType: PropertiesEnum.SWITCH
                }, {
                    pTitle: '文字内容',
                    pKey: 'textValue',
                    pValue: this.getCustomState().getTextValue(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '背景颜色',
                    pKey: 'backgroundColor',
                    pValue: this.getCustomState().getBackgroundColor(),
                    pType: PropertiesEnum.COLOR_PICKER
                }, {
                    pTitle: '边框颜色',
                    pKey: 'borderColor',
                    pValue: this.getCustomState().getBorderColor(),
                    pType: PropertiesEnum.COLOR_PICKER
                }, {
                    pTitle: '边框宽度',
                    pKey: 'borderWidth',
                    pValue: this.getCustomState().getBorderWidth(),
                    pType: PropertiesEnum.SLIDER
                }
            ];
    }

    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newButtonState: ButtonState = ButtonState.set(this.getCustomState(), properties);

        this.setCustomState(newButtonState);
    }

    // private onClick = () => {
    //     const newButtonState: ButtonState = ButtonState.set(
    //         this.getCustomState(),
    //         {
    //             type: 'danger'
    //         }
    //     );

    //     this.setCustomState(newButtonState);
    // }

    private setCircle = (): 'circle' | 'circle-outline' | undefined   => {
        if (this.getCustomState().getIsCircle()) {
            return 'circle-outline';
        } else return undefined;
    }

}
