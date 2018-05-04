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
                        fontWeight: this.getCustomState().getFontWeight(), backgroundColor: this.getCustomState().getBackgroundColor()
                        // , borderStyle: 'solid',
                        // borderColor: this.getCustomState().getBorderColor(), borderWidth: this.getCustomState().getBorderWidth()
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
                }, {
                    pTitle: '文字内容',
                    pKey: 'textValue',
                    pValue: this.getCustomState().getTextValue(),
                    pType: PropertiesEnum.INPUT_STRING
                }
                // , {
                //     pTitle: '是否禁用',
                //     pKey: 'disabled',
                //     pValue: this.getCustomState().getDisabled(),
                //     pType: PropertiesEnum.SWITCH
                // }
                // 禁用后 在画布上点击组件无法选中
            ];
    }

    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newInputState: ButtonState = ButtonState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
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
