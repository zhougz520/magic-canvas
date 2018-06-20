import * as React from 'react';

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

import { HyperlinkState, IHyperlinkState } from './HyperlinkState';
import { PropertiesEnum } from '../model/types';
import { IProperty } from '../model/types';
import { BoxType } from '../../util';

import { Map } from 'immutable';

// tslint:disable:jsx-no-multiline-js
export default class Hyperlink extends BaseUniversalComponent<IBaseUniversalComponentProps, IBaseUniversalComponentState> {
    constructor(props: IBaseUniversalComponentProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new HyperlinkState()),
            hidden: false
        };
    }

    public getType(): string {
        return BoxType.BarType;
    }

    /**
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditOption = (): IRichEditOption => {
        const comPosition: IPosition = this.getPosition();
        const comSize: ISize = this.getSize();

        const position: IPosition = comPosition;
        const size: ISize = comSize;
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
        const newButtonState: HyperlinkState = HyperlinkState.set(this.getCustomState(), Map(config));

        this.setCustomState(newButtonState);
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): IProperty[] => {
        return [
            {
                pTitle: '链接地址',
                pKey: 'herf',
                pValue: this.getCustomState().getHerf(),
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
        const newHyperlinkState: HyperlinkState = HyperlinkState.set(this.getCustomState(), properties);

        this.setCustomState(newHyperlinkState);
    }

    render() {
        const { hidden } = this.state;

        return (
            <div
                style={{
                    ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false),
                    backgroundColor: this.getCustomState().getBackgroundColor(),
                    borderColor: this.getCustomState().getBorderColor(),
                    borderWidth: this.getCustomState().getBorderWidth(),
                    borderStyle: 'solid'
                }}
                onMouseDown={this.fireSelectChange}
                onDoubleClick={this.doDbClickToEdit}
            >
                <MaskLayer id={this.getCid()} />
                <a
                    href={this.getCustomState().getHerf()}
                >
                    <div
                        style={{
                            visibility: hidden ? 'hidden' : 'visible',
                            display: 'inline-block',
                            width: '100%',
                            height: '100%',
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
                </a>
            </div>
        );
    }
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：IButtonState
 */
export function convertFromDataToCustomState(
    customData: IHyperlinkState
): any {
    return new HyperlinkState(customData);
}
