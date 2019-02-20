import * as React from 'react';
import { Input } from 'antd';

import {
    BaseStyle,
    IRichEditOption,
    IFont,
    IPosition,
    ISize,
    EditType
} from '../../BaseComponent';
import {
    BaseUniversalComponent,
    IBaseUniversalComponentProps,
    IBaseUniversalComponentState
} from '../BaseUniversalComponent';
import { MaskLayer } from '../../BaseComponent';

import { BusinessContextState, IBusinessContextState } from './BusinessContextState';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../model/types';

import { Map, OrderedSet, List } from 'immutable';

import '../../UniversalComponents/sass/UComponents.scss';

// tslint:disable:jsx-no-multiline-js
export default class BusinessContext extends BaseUniversalComponent<IBaseUniversalComponentProps, IBaseUniversalComponentState> {
    constructor(props: IBaseUniversalComponentProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new BusinessContextState()),
            hidden: false
        };
    }

    /**
     * 调用富文本编辑器
     */
    public getRichEditType = (): EditType => {
        return 'TextArea';
    }

    /**
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditOption = (): IRichEditOption => {
        const comPosition: IPosition = this.getPosition();
        const comSize: ISize = this.getSize();
        const position: IPosition = {
            top: comPosition.top + 28,
            left: comPosition.left + 8
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
        const newBusinessContextState: BusinessContextState = BusinessContextState.set(this.getCustomState(), Map(config));

        this.setCustomState(newBusinessContextState);
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 字段设置
        propertyList = propertyList.push(
            {
                pTitle: '文字内容',
                pKey: 'textValue',
                pValue: this.getCustomState().getTextValue(),
                pType: PropertiesEnum.INPUT_TEXTAREA
            },
            // {
            //     pTitle: '段落对齐',
            //     pKey: 'txt_val',
            //     pValue: this.getCustomState().getTxtVal(),
            //     pType: PropertiesEnum.SELECT,
            //     pList: [{ key: 'top', value: '上端对齐' }, { key: 'middle', value: '居中对齐' }, { key: 'bottom', value: '下端对齐' }] },
            {
                pTitle: '行高',
                pKey: 'txt_lh',
                pValue: this.getCustomState().getTxtLineHeight(),
                pType: PropertiesEnum.SELECT, pList: [{ key: '1', value: '1' }, { key: '1.2', value: '1.2' }, { key: '1.5', value: '1.5' }, { key: '2', value: '2' }, { key: '2.5', value: '2.5' }, { key: '3', value: '3' }] }
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
        const newBusinessContextState: BusinessContextState = BusinessContextState.set(this.getCustomState(), properties);
        this.setCustomState(newBusinessContextState, true, callback);
    }

    render() {
        const { hidden } = this.state;
        const txtLineHeight = this.getCustomState().getTxtLineHeight();
        const fontSize = this.getCustomState().getFontSize();
        let lineHeightStyle: number = fontSize;
        switch (txtLineHeight) {
            case '1.2':
                lineHeightStyle = fontSize + 4;
                break;
            case '1.5':
                lineHeightStyle = fontSize + 8;
                break;
            case '2':
                lineHeightStyle = fontSize + 12;
                break;
            case '2.5':
                lineHeightStyle = fontSize + 16;
                break;
            case '3':
                lineHeightStyle = fontSize + 20;
                break;
        }

        return (
            <div
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false, this.isCanSelected())}
                onMouseDown={this.fireSelectChange}
                className="universalBussiness"
                onDoubleClick={this.doDbClickToEdit}
            >
                <div className="businessBg">业务背景</div>
                <MaskLayer id={this.getCid()} pageMode={this.props.pageMode} isCanSelected={this.isCanSelected()} />
                <Input.TextArea
                    style={{
                        flex: '1',
                        color: this.getCustomState().getFontColor(),
                        textAlign: this.getCustomState().getTextAlign(),
                        fontStyle: this.getCustomState().getFontStyle(),
                        textDecoration: this.getCustomState().getTextDecoration(),
                        fontSize: this.getCustomState().getFontSize(),
                        fontWeight: this.getCustomState().getFontWeight(),
                        lineHeight: lineHeightStyle + 'px'
                    }}
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
    customData: IBusinessContextState
): any {
    return new BusinessContextState(customData);
}
