import * as React from 'react';
import { Checkbox as AntCheckbox } from 'antd';

import {
    BaseStyle,
    IRichEditOption,
    IPosition,
    ISize,
    IFont
} from '../../BaseComponent';
import {
    BaseUniversalComponent,
    IBaseUniversalComponentProps,
    IBaseUniversalComponentState
} from '../BaseUniversalComponent';
import { MaskLayer } from '../../BaseComponent';

import { CheckBoxState, ICheckBoxState } from './CheckBoxState';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../model/types';
// import { BoxType } from '../../util';

import { Map, OrderedSet, List } from 'immutable';

// tslint:disable:jsx-no-multiline-js
export default class CheckBox extends BaseUniversalComponent<IBaseUniversalComponentProps, IBaseUniversalComponentState> {
    private _padding: number = 30;

    constructor(props: IBaseUniversalComponentProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new CheckBoxState()),
            hidden: false
        };
    }

    // public getType(): string {
    //     return BoxType.BarType;
    // }

    /**
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditOption = (): IRichEditOption => {
        const comPosition: IPosition = this.getPosition();
        const comSize: ISize = this.getSize();

        const position: IPosition = {
            top: comPosition.top,
            left: comPosition.left + this._padding
        };
        const size: ISize = {
            width: comSize.width - this._padding - 8,
            height: comSize.height
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
        const newButtonState: CheckBoxState = CheckBoxState.set(this.getCustomState(), Map(config));

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
            { pTitle: '是否选中', pKey: 'isCheck', pValue: this.getCustomState().getIsCheck(), pType: PropertiesEnum.SWITCH, pFilterValue: false, pFilterFun: 'isShow', pFilterKey: [{groupKey: 'exterior', pKey: 'backgroundColor'}, {groupKey: 'field'}]},
            { pTitle: '是否禁用', pKey: 'disabled', pValue: this.getCustomState().getDisabled(), pType: PropertiesEnum.SWITCH },
            { pTitle: '背景颜色', pKey: 'backgroundColor', pValue: this.getCustomState().getBackgroundColor(), pType: PropertiesEnum.COLOR_PICKER }
            // { pTitle: '边框颜色', pKey: 'borderColor', pValue: this.getCustomState().getBorderColor(), pType: PropertiesEnum.COLOR_PICKER },
            // { pTitle: '边框宽度', pKey: 'borderWidth', pValue: this.getCustomState().getBorderWidth(), pType: PropertiesEnum.SLIDER }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '外观', groupKey: 'exterior', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        // 字段设置
        propertyList = propertyList.push(
            { pTitle: '文字内容', pKey: 'textValue', pValue: this.getCustomState().getTextValue(), pType: PropertiesEnum.INPUT_TEXT }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '字段设置', groupKey: 'field', isActive: true, colNum: 1, propertyList }
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
        const newCheckBoxState: CheckBoxState = CheckBoxState.set(this.getCustomState(), properties);

        this.setCustomState(newCheckBoxState, true, callback);
    }

    render() {
        const { hidden } = this.state;

        return (
            <div
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false, this.isCanSelected())}
                onMouseDown={this.fireSelectChange}
                onDoubleClick={this.doDbClickToEdit}
            >
                <MaskLayer id={this.getCid()} pageMode={this.props.pageMode} isCanSelected={this.isCanSelected()} />
                <AntCheckbox
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'left',
                        alignItems: 'center',
                        backgroundColor: this.getCustomState().getBackgroundColor(),
                        borderColor: this.getCustomState().getBorderColor(),
                        borderWidth: this.getCustomState().getBorderWidth(),
                        borderStyle: 'solid',
                        paddingLeft: '6px'
                    }}
                    checked={this.getCustomState().getIsCheck()}
                    disabled={this.getCustomState().getDisabled()}
                    // tslint:disable-next-line:jsx-no-lambda no-empty
                    onChange={(e) => this.changeValue(e)}
                >
                    <div
                        style={{
                            visibility: hidden ? 'hidden' : 'visible',
                            display: 'inline-block',
                            width: 'auto',
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
                </AntCheckbox>
            </div>
        );
    }

    private changeValue = (e: any) => {
        if (e.target) {
            this.setPropertiesFromProperty('isCheck', e.target.checked);
        }
    }
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：IButtonState
 */
export function convertFromDataToCustomState(
    customData: ICheckBoxState
): any {
    return new CheckBoxState(customData);
}
