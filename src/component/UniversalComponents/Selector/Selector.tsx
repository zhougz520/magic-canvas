import * as React from 'react';
import { Select as AntSelector } from 'antd';

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
import { MaskLayer } from '../../BaseComponent/mask/MaskLayer';

import { SelectorState, ISelectorState } from './SelectorState';
import { PropertiesEnum } from '../model/types';
import { IProperty } from '../model/types';
import { BoxType } from '../../util';

import { Map, List } from 'immutable';

// tslint:disable:jsx-no-multiline-js
export default class Selector extends BaseUniversalComponent<IBaseUniversalComponentProps, IBaseUniversalComponentState> {
    constructor(props: IBaseUniversalComponentProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new SelectorState()),
            hidden: false
        };
    }

    public getType(): string {
        return BoxType.BarType;
    }

    /**
     * 调用富文本编辑器
     */
    public getRichEditType = (): EditType => {
        return 'none';
    }

    /**
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditOption = (): IRichEditOption => {
        const comPosition: IPosition = this.getPosition();
        const comSize: ISize = this.getSize();

        const position: IPosition = {
            top: comPosition.top,
            left: comPosition.left
        };
        const size: ISize = {
            width: comSize.width,
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
        const newSelectorState: SelectorState = SelectorState.set(this.getCustomState(), Map(config));

        this.setCustomState(newSelectorState);
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): IProperty[] => {
        return [
            {
                pTitle: '选项',
                pKey: 'options',
                pValue: this.getCustomState().getOptions(),
                pType: PropertiesEnum.INPUT_OBJECT_LIST
            }, {
                pTitle: '选中项',
                pKey: 'textValue',
                pValue: this.getCustomState().getTextValue(),
                pType: PropertiesEnum.INPUT_STRING
            }, {
                pTitle: '是否禁用',
                pKey: 'disabled',
                pValue: this.getCustomState().getDisabled(),
                pType: PropertiesEnum.SWITCH
            }
        ];
    }

    /**
     * 设置属性
     */
    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newSelectorState: SelectorState = SelectorState.set(this.getCustomState(), properties);

        this.setCustomState(newSelectorState);
    }

    render() {

        return (
            <div
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                onMouseDown={this.fireSelectChange}
            >
                <MaskLayer id={this.getCid()} />
                <AntSelector
                    style={{
                        width: '100%',
                        height: '100%',
                        color: this.getCustomState().getFontColor(),
                        fontStyle: this.getCustomState().getFontStyle(),
                        textDecoration: this.getCustomState().getTextDecoration(),
                        fontSize: this.getCustomState().getFontSize(),
                        fontWeight: this.getCustomState().getFontWeight(),
                        textAlign: this.getCustomState().getTextAlign()
                    }}
                    disabled={this.getCustomState().getDisabled()}
                    value={this.getCustomState().getTextValue()}
                >
                    {this.optionElem()}
                </AntSelector>

            </div>
        );
    }

    private optionElem = () => {
        const optionList: List<Map<any, any>> = this.getCustomState().getOptions();

        const res: any[] = [];
        optionList.map(
            (option: Map<any, any>) => {
                res.push(
                    <AntSelector.Option
                        key={option.get('label')}
                    >
                        {option.get('label')}
                    </AntSelector.Option>
                );
            }
        );

        return res;
    }
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：IButtonState
 */
export function convertFromDataToCustomState(
    customData: ISelectorState
): any {
    return new SelectorState(customData);
}
