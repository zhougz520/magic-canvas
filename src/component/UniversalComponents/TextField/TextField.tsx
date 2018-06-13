import * as React from 'react';
import { Input } from 'antd';

import {
    BaseStyle,
    IRichEditOption,
    IFont,
    IPosition,
    ISize
} from '../../BaseComponent';
import {
    BaseUniversalComponent,
    IBaseUniversalComponentProps,
    IBaseUniversalComponentState
} from '../BaseUniversalComponent';
import { MaskLayer } from '../../BaseComponent/mask/MaskLayer';

import { TextFieldState, ITextFieldState } from './TextFieldState';
import { PropertiesEnum } from '../types';

import { Map } from 'immutable';

// tslint:disable:jsx-no-multiline-js
export default class TextField extends BaseUniversalComponent<IBaseUniversalComponentProps, IBaseUniversalComponentState> {
    constructor(props: IBaseUniversalComponentProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new TextFieldState()),
            hidden: false
        };
    }

    /**
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditOption = (): IRichEditOption => {
        const comPosition: IPosition = this.getPosition();
        const comSize: ISize = this.getSize();

        const position: IPosition = {
            top: comPosition.top + 4,
            left: comPosition.left + 11
        };
        const size: ISize = {
            width: comSize.width - 22,
            height: comSize.height - 8
        };
        const font: IFont = {
            textAlign: this.getCustomState().getTextAlign(),
            fontColor: this.getCustomState().getFontColor(),
            fontStyle: this.getCustomState().getFontStyle(),
            textDecoration: this.getCustomState().getTextDecoration(),
            fontSize: this.getCustomState().getFontSize(),
            fontWeight: this.getCustomState().getFontWeight()
        };

        return { position, size, font };
    }

    /**
     * 设置组件文本内容
     */
    public setRichChildNode = (param: any): void => {
        const config = {
            textValue: param.value,
            ...param.font
        };
        const newTextFieldState: TextFieldState = TextFieldState.set(this.getCustomState(), Map(config));

        this.setCustomState(newTextFieldState);
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): Array<{ pTitle: string, pKey: string, pValue: any, pType: string }> => {
        return [
            {
                pTitle: '输入框提示',
                pKey: 'placeholder',
                pValue: this.getCustomState().getPlaceholder(),
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

    /**
     * 设置属性
     */
    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newTextFieldState: TextFieldState = TextFieldState.set(this.getCustomState(), properties);

        this.setCustomState(newTextFieldState);
    }

    render() {
        const { hidden } = this.state;

        return (
            <div
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                onMouseDown={this.fireSelectChange}
                onDoubleClick={this.doDbClickToEdit}
            >
                <MaskLayer id={this.getCid()} />
                <Input.TextArea
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: this.getCustomState().getBackgroundColor(),
                        borderColor: this.getCustomState().getBorderColor(),
                        borderWidth: this.getCustomState().getBorderWidth(),
                        color: this.getCustomState().getFontColor(),
                        fontStyle: this.getCustomState().getFontStyle(),
                        textDecoration: this.getCustomState().getTextDecoration(),
                        fontSize: this.getCustomState().getFontSize(),
                        fontWeight: this.getCustomState().getFontWeight(),
                        textAlign: this.getCustomState().getTextAlign()
                    }}
                    placeholder={hidden ? '' : this.getCustomState().getPlaceholder()}
                    value={hidden ? '' : this.getCustomState().getTextValue()}
                />
            </div>
        );
    }

}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：IButtonState
 */
export function convertFromDataToCustomState(
    customData: ITextFieldState
): any {
    return new TextFieldState(customData);
}
