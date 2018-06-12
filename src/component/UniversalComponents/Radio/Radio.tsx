import * as React from 'react';
import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { Radio as AntRadio } from 'antd';

import { RadioState, IRadioState } from './RadioState';
import { Map } from 'immutable';
import { PropertiesEnum } from '../types';
import { MaskLayer } from '../../BaseComponent/mask/MaskLayer';

const AntRadioButton = AntRadio.Button;

export default class Radio extends BaseComponent<IBaseProps, IBaseState> {
    com: any = null;
    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new RadioState())
        };
    }

    // public getType(): string {
    //     return BoxType.BarType;
    // }

    render() {
        if (this.getCustomState().getIsButton()) {
            return (

                <div
                    onMouseDown={this.fireSelectChange}
                    ref={(handler: HTMLElement | null) => this.com = handler}
                    style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                >
                    <MaskLayer id={this.getCid()} />
                    <AntRadioButton
                        // tslint:disable-next-line:jsx-no-multiline-js
                        style={{
                            width: '100%', height: '100%', color: this.getCustomState().getFontColor(),
                            fontSize: this.getCustomState().getFontSize() + 'px',
                            fontWeight: this.getCustomState().getFontWeight(), backgroundColor: this.getCustomState().getBackgroundColor(), borderStyle: 'solid',
                            borderColor: this.getCustomState().getBorderColor(), borderWidth: this.getCustomState().getBorderWidth()
                        }}
                        checked={this.getCustomState().getChecked()}
                        disabled={this.getCustomState().getDisabled()}
                    >
                        <span
                            style={{ display: 'inline-block', width: '85%', textAlign: this.getCustomState().getTextAlign(), textDecoration: this.getCustomState().getTextDecoration(), fontStyle: this.getCustomState().getFontStyle() }}
                        >
                            {this.getCustomState().getValue()}
                        </span>
                    </AntRadioButton>
                </div>
            );
        } else {
            return (
                <div
                    onMouseDown={this.fireSelectChange}
                    ref={(handler: HTMLElement | null) => this.com = handler}
                    style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                >
                    <AntRadio
                        // tslint:disable-next-line:jsx-no-multiline-js
                        style={{
                            width: '100%', height: '100%', color: this.getCustomState().getFontColor(),
                            fontSize: this.getCustomState().getFontSize() + 'px',
                            fontWeight: this.getCustomState().getFontWeight(), backgroundColor: this.getCustomState().getBackgroundColor(), borderStyle: 'solid',
                            borderColor: this.getCustomState().getBorderColor(), borderWidth: this.getCustomState().getBorderWidth() + 'px',
                            fontStyle: this.getCustomState().getFontStyle()
                        }}
                        checked={this.getCustomState().getChecked()}
                        disabled={this.getCustomState().getDisabled()}

                    >
                        <span
                            style={{ display: 'inline-block', width: '85%', textAlign: this.getCustomState().getTextAlign(), textDecoration: this.getCustomState().getTextDecoration() }}
                        >
                            {this.getCustomState().getValue()}
                        </span>
                    </AntRadio>
                </div>
            );
        }
    }

    public getPropertiesToProperty = (): Array<{ pTitle: string, pKey: string, pValue: any, pType: string }> => {
        return [
            {
                pTitle: '选项',
                pKey: 'value',
                pValue: this.getCustomState().getValue(),
                pType: PropertiesEnum.INPUT_STRING
            }, {
                pTitle: '是否选中',
                pKey: 'checked',
                pValue: this.getCustomState().getChecked(),
                pType: PropertiesEnum.SWITCH
            }, {
                pTitle: '是否为方形按钮',
                pKey: 'isButton',
                pValue: this.getCustomState().getIsButton(),
                pType: PropertiesEnum.SWITCH
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
        let propertiesMap = Map();
        propertiesMap = propertiesMap.set(pKey, pValue);
        const newRadioState: RadioState = RadioState.set(
            this.getCustomState(), propertiesMap
        );
        this.setCustomState(newRadioState);
    }
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：IButtonState
 */
export function convertFromDataToCustomState(
    customData: IRadioState
): any {
    return new RadioState(customData);
}
