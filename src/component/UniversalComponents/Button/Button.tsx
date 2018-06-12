import * as React from 'react';
import { Button as AntButton } from 'antd';

import {
    BaseComponent,
    BaseStyle,
    IBaseProps,
    IBaseState,
    EditType,
    IRichEditOption,
    IFont,
    IPosition,
    ISize
} from '../../BaseComponent';
import { ButtonState, IButtonState } from './ButtonState';
import { PropertiesEnum } from '../types';
import { IProperty } from '../model/types';

import { Map } from 'immutable';
import { MaskLayer } from '../../BaseComponent/mask/MaskLayer';

export interface ICustomState extends IBaseState {
    hidden: boolean;
}

// tslint:disable:jsx-no-multiline-js
export default class Button extends BaseComponent<IBaseProps, ICustomState> {
    private _padding: number = 15;

    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new ButtonState()),
            hidden: false
        };
    }

    /**
     * 调用富文本编辑器
     */
    public getRichEditType = (): EditType => {
        return 'Text';
    }

    /**
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditOption = (): IRichEditOption => {
        const comPosition: IPosition = this.getPosition();
        const comSize: ISize = this.getSize();

        const position: IPosition = {
            top: comPosition.top + (comSize.height - 21) / 2,
            left: comPosition.left + this._padding
        };
        const size: ISize = {
            width: comSize.width - 2 * this._padding,
            height: 21
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
     * 隐藏文本展示Div
     */
    public hiddenEditorDom = (isHidden: boolean): void => {
        this.setState({
            hidden: isHidden
        });
    }

    /**
     * 重写Base方法，是否可以双击修改
     */
    public isDbClickToEdit = (): boolean => {
        return true;
    }

    /**
     * 获取组件文本
     */
    public getRichChildNode = (): any => {
        return this.getCustomState().getTextValue();
    }

    public setRichChildNode = (param: any): void => {
        const config = {
            textValue: param.value,
            ...param.font
        };
        const newButtonState: ButtonState = ButtonState.set(this.getCustomState(), Map(config));

        this.setCustomState(newButtonState);
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
                <AntButton
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: this.getCustomState().getBackgroundColor(),
                        borderColor: this.getCustomState().getBorderColor(),
                        borderWidth: this.getCustomState().getBorderWidth()
                    }}
                    type={this.getCustomState().getType()}
                    shape={this.getCustomState().getIsCircle() ? 'circle' : undefined}
                    disabled={this.getCustomState().getDisabled()}
                >
                    <div
                        style={{
                            visibility: hidden ? 'hidden' : 'visible',
                            display: 'inline-block',
                            width: '100%',
                            textAlign: this.getCustomState().getTextAlign(),
                            color: this.getCustomState().getFontColor(),
                            fontStyle: this.getCustomState().getFontStyle(),
                            textDecoration: this.getCustomState().getTextDecoration(),
                            fontSize: this.getCustomState().getFontSize(),
                            fontWeight: this.getCustomState().getFontWeight()
                        }}
                    >
                        {this.getCustomState().getTextValue()}
                    </div>
                </AntButton>
            </div>
        );
    }

    public getPropertiesToProperty = (): IProperty[] => {
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
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：IButtonState
 */
export function convertFromDataToCustomState(
    customData: IButtonState
): any {
    return new ButtonState(customData);
}
