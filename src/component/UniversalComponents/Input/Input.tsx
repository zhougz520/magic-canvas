import * as React from 'react';
import { Input as AntInput } from 'antd';

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

import { InputState, IInputState } from './InputState';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../model/types';

import { Map, OrderedSet, List } from 'immutable';

// tslint:disable:jsx-no-multiline-js
export default class Input extends BaseUniversalComponent<IBaseUniversalComponentProps, IBaseUniversalComponentState> {
    private _padding: number = 11;

    constructor(props: IBaseUniversalComponentProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new InputState()),
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
            top: comPosition.top,
            left: comPosition.left + this._padding
        };
        const size: ISize = {
            width: comSize.width - this._padding,
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
        const newInputState: InputState = InputState.set(this.getCustomState(), Map(config));

        this.setCustomState(newInputState);
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 外观
        propertyList = propertyList.push(
            { pTitle: '背景颜色', pKey: 'backgroundColor', pValue: this.getCustomState().getBackgroundColor(), pType: PropertiesEnum.COLOR_PICKER },
            { pTitle: '边框颜色', pKey: 'borderColor', pValue: this.getCustomState().getBorderColor(), pType: PropertiesEnum.COLOR_PICKER },
            { pTitle: '边框宽度', pKey: 'borderWidth', pValue: this.getCustomState().getBorderWidth(), pType: PropertiesEnum.SLIDER }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '外观', groupKey: 'exterior', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        // 字段设置
        propertyList = propertyList.push(
            { pTitle: '文字内容', pKey: 'textValue', pValue: this.getCustomState().getTextValue(), pType: PropertiesEnum.INPUT_TEXT },
            { pTitle: '提示信息', pKey: 'placeholder', pValue: this.getCustomState().getPlaceholder(), pType: PropertiesEnum.INPUT_TEXT }
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
        const newInputState: InputState = InputState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState, true, callback);
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
                <AntInput
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
                    // tslint:disable-next-line:jsx-no-lambda no-empty
                    onChange={() => { }}
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
    customData: IInputState
): any {
    return new InputState(customData);
}
