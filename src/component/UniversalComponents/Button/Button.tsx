import * as React from 'react';
import { Button as AntButton } from 'antd';

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
import { MaskLayer } from '../../BaseComponent';

import { ButtonState, IButtonState } from './ButtonState';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../model/types';

import { Map, OrderedSet, List } from 'immutable';

// tslint:disable:jsx-no-multiline-js
export default class Button extends BaseUniversalComponent<IBaseUniversalComponentProps, IBaseUniversalComponentState> {
    private _padding: number = 15;

    constructor(props: IBaseUniversalComponentProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new ButtonState()),
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
     * 设置组件文本内容
     */
    public setRichChildNode = (param: any): void => {
        const config = {
            textValue: param.value,
            ...param.font
        };
        const newButtonState: ButtonState = ButtonState.set(this.getCustomState(), Map(config));

        this.setCustomState(newButtonState);
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 外观
        propertyList = propertyList.push(
            {
                pTitle: '是否圆形',
                pKey: 'isCircle',
                pValue: this.getCustomState().getIsCircle(),
                pType: PropertiesEnum.SWITCH
            },
            {
                pTitle: '是否禁用',
                pKey: 'disabled',
                pValue: this.getCustomState().getDisabled(),
                pType: PropertiesEnum.SWITCH
            },
            {
                pTitle: '背景颜色',
                pKey: 'backgroundColor',
                pValue: this.getCustomState().getBackgroundColor(),
                pType: PropertiesEnum.COLOR_PICKER
            },
            {
                pTitle: '边框颜色',
                pKey: 'borderColor',
                pValue: this.getCustomState().getBorderColor(),
                pType: PropertiesEnum.COLOR_PICKER
            },
            {
                pTitle: '边框宽度',
                pKey: 'borderWidth',
                pValue: this.getCustomState().getBorderWidth(),
                pType: PropertiesEnum.SLIDER
            }
        );
        propertyGroup = propertyGroup.add(
            {
                groupTitle: '外观',
                groupKey: 'exterior',
                colNum: 1,
                propertyList
            }
        );
        propertyList = List();

        // 字段设置
        propertyList = propertyList.push(
            {
                pTitle: '文字内容',
                pKey: 'textValue',
                pValue: this.getCustomState().getTextValue(),
                pType: PropertiesEnum.INPUT_TEXT
            }
        );
        propertyGroup = propertyGroup.add(
            {
                groupTitle: '字段设置',
                groupKey: 'field',
                colNum: 1,
                propertyList
            }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 设置属性
     */
    public setPropertiesFromProperty = (pKey: string, pValue: any, callback?: () => void) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newButtonState: ButtonState = ButtonState.set(this.getCustomState(), properties);

        this.setCustomState(newButtonState, true, callback);
    }

    render() {
        const { hidden } = this.state;
        const disabled: boolean = this.getCustomState().getDisabled();

        return (
            <div
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                onMouseDown={this.fireSelectChange}
                onDoubleClick={this.doDbClickToEdit}
            >
                <MaskLayer id={this.getCid()} pageMode={this.props.pageMode} />
                <AntButton
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: disabled ? undefined : this.getCustomState().getBackgroundColor(),
                        borderColor: disabled ? undefined : this.getCustomState().getBorderColor(),
                        borderWidth: this.getCustomState().getBorderWidth()
                    }}
                    type={this.getCustomState().getType()}
                    shape={this.getCustomState().getIsCircle() ? 'circle' : undefined}
                    disabled={disabled}
                >
                    <div
                        style={{
                            visibility: hidden ? 'hidden' : 'visible',
                            display: 'inline-block',
                            width: '100%',
                            textAlign: this.getCustomState().getTextAlign(),
                            color: disabled ? undefined : this.getCustomState().getFontColor(),
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
